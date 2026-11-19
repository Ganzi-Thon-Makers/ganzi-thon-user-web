import { TimeoutError } from "ky";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { clearAccessToken, getAccessToken, setAccessToken } from "./token";

const refreshPath = "/api/auth/refresh";
const unauthorized = () => new Response(null, { status: 401 });
const refreshed = () => Response.json({ data: { accessToken: "fresh-token" } });

async function mockClient(backend: (request: Request) => Promise<Response>, pathname?: string) {
  const replace = vi.fn<(path: string) => void>();
  const fetch = vi.fn<(request: Request) => Promise<Response>>(backend);

  vi.stubGlobal("window", { localStorage, location: { origin: "http://localhost:3000", pathname, replace } });
  vi.stubGlobal("fetch", fetch);

  const { api } = await import("./client");
  const { getQueryClient } = await import("../lib/query-client");
  return { api, fetch, replace, queryClient: getQueryClient() };
}

beforeEach(() => {
  vi.resetModules();
  setAccessToken("stored-token");
});

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

it.each([true, false])(
  "동시 및 지연 401 응답은 한 번 재발급한 토큰을 재사용한다 (access token 있음: %s)",
  async (hasToken) => {
    if (!hasToken) clearAccessToken();
    const late = Promise.withResolvers<Response>();
    const pendingRefresh = Promise.withResolvers<Response>();
    const { api, fetch, replace } = await mockClient(async (request) => {
      const { pathname } = new URL(request.url);
      if (pathname === refreshPath) return pendingRefresh.promise;
      if (request.headers.get("Authorization") === "Bearer fresh-token") return Response.json({ ok: true });
      return pathname === "/late" ? late.promise : unauthorized();
    });

    const first = api.get("first").json();
    const second = api.get("second").json();
    const delayed = api.get("late").json();
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(4));
    pendingRefresh.resolve(refreshed());
    await expect(Promise.all([first, second])).resolves.toEqual([{ ok: true }, { ok: true }]);
    late.resolve(unauthorized());
    await expect(delayed).resolves.toEqual({ ok: true });

    expect(fetch.mock.calls.filter(([request]) => new URL(request.url).pathname === refreshPath)).toHaveLength(1);
    expect(getAccessToken()).toBe("fresh-token");
    expect(replace).not.toHaveBeenCalled();
  },
);

it.each([true, false])(
  "재발급 API가 401이면 토큰을 지우고 로그인 화면으로 이동한다 (access token 있음: %s)",
  async (hasToken) => {
    if (!hasToken) clearAccessToken();
    const { api, fetch, replace } = await mockClient(async () => unauthorized());

    await expect(api.get("projects")).rejects.toMatchObject({ response: { status: 401 } });
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(getAccessToken()).toBeNull();
    expect(replace).toHaveBeenCalledExactlyOnceWith("/");
  },
);

it("스탬프 적립 화면에서 로그인이 풀리면 돌아올 경로를 담아 한 번만 로그인 화면으로 보낸다", async () => {
  clearAccessToken();
  const { api, replace } = await mockClient(async () => unauthorized(), "/stamp/collect");
  const { isLoginRedirectPending } = await import("./client");
  expect(isLoginRedirectPending()).toBe(false);

  await expect(api.post("stamps")).rejects.toMatchObject({ response: { status: 401 } });
  await expect(api.get("stamps")).rejects.toMatchObject({ response: { status: 401 } });
  expect(replace).toHaveBeenCalledExactlyOnceWith("/?next=%2Fstamp%2Fcollect");
  expect(isLoginRedirectPending()).toBe(true);
});

it("재발급한 토큰이 삭제되면 다음 401에서 다시 재발급한다", async () => {
  clearAccessToken();
  let refreshCount = 0;
  const { api, replace } = await mockClient(async (request) => {
    if (new URL(request.url).pathname === refreshPath) {
      refreshCount += 1;
      return refreshCount === 1 ? refreshed() : unauthorized();
    }
    return request.headers.has("Authorization") ? Response.json({ ok: true }) : unauthorized();
  });

  await expect(api.get("projects").json()).resolves.toEqual({ ok: true });
  clearAccessToken();
  await expect(api.get("projects")).rejects.toMatchObject({ response: { status: 401 } });
  expect(refreshCount).toBe(2);
  expect(replace).toHaveBeenCalledExactlyOnceWith("/");
});

it("새 access token으로 다시 보낸 조회가 401이면 쿼리를 자동 재시도하지 않는다", async () => {
  const { api, fetch, replace, queryClient } = await mockClient(async (request) =>
    new URL(request.url).pathname === refreshPath ? refreshed() : unauthorized(),
  );

  const query = { queryKey: ["projects"], queryFn: () => api.get("projects").json(), retryDelay: 0 };
  await expect(queryClient.fetchQuery(query)).rejects.toMatchObject({ response: { status: 401 } });
  expect(fetch).toHaveBeenCalledTimes(3);
  expect(getAccessToken()).toBe("fresh-token");
  expect(replace).not.toHaveBeenCalled();
});

it("이전 요청의 401은 새 로그인 토큰을 지우지 않는다", async () => {
  const { api, fetch, replace } = await mockClient(async () => {
    setAccessToken("new-token");
    return unauthorized();
  });

  await expect(api.get("projects")).rejects.toMatchObject({ response: { status: 401 } });
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(getAccessToken()).toBe("new-token");
  expect(replace).not.toHaveBeenCalled();
});

it.each([
  { failure: "server", expectedError: { response: { status: 502 } } },
  { failure: "network", expectedError: { name: "NetworkError" } },
  { failure: "timeout", expectedError: { name: "TimeoutError" } },
])(
  "재발급 실패($failure) 시 자동 재시도를 생략하고 다음 조회에서 다시 재발급한다",
  async ({ failure, expectedError }) => {
    let refreshFailed = true;
    const { api, fetch, replace, queryClient } = await mockClient(async (request) => {
      if (new URL(request.url).pathname === refreshPath) {
        if (!refreshFailed) return refreshed();
        if (failure === "network") throw new TypeError("Failed to fetch");
        if (failure === "timeout") throw new TimeoutError(request);
        return new Response(null, { status: 502 });
      }

      return request.headers.get("Authorization") === "Bearer fresh-token"
        ? Response.json({ ok: true })
        : unauthorized();
    });

    const query = { queryKey: ["projects"], queryFn: () => api.get("projects").json(), retryDelay: 0 };
    await expect(queryClient.fetchQuery(query)).rejects.toMatchObject(expectedError);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(getAccessToken()).toBe("stored-token");
    expect(replace).not.toHaveBeenCalled();

    refreshFailed = false;
    await expect(queryClient.fetchQuery(query)).resolves.toEqual({ ok: true });
    expect(getAccessToken()).toBe("fresh-token");
  },
);

it.each([
  { failure: "server", expectedError: { response: { status: 500 } } },
  { failure: "network", expectedError: { name: "NetworkError" } },
])("일반 조회 오류($failure)는 한 번 자동 재시도한다", async ({ failure, expectedError }) => {
  const { api, fetch, queryClient } = await mockClient(async () => {
    if (failure === "network") throw new TypeError("Failed to fetch");
    return new Response(null, { status: 500 });
  });

  const query = { queryKey: ["projects"], queryFn: () => api.get("projects").json(), retryDelay: 0 };
  await expect(queryClient.fetchQuery(query)).rejects.toMatchObject(expectedError);
  expect(fetch).toHaveBeenCalledTimes(2);
});
