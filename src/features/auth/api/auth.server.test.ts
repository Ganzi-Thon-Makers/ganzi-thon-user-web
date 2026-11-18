// @vitest-environment node

import { NextRequest } from "next/server";
import { afterEach, expect, it, vi } from "vitest";

import { login, refresh } from "./auth.server";

const bridgeOrigin = "http://localhost:3000";

function authRequest(
  action: string,
  {
    cookie,
    body,
    origin = bridgeOrigin,
  }: {
    cookie?: string;
    body?: string;
    origin?: string;
  } = {},
) {
  const headers = new Headers({ origin, host: "localhost:3000" });
  if (cookie) headers.set("cookie", cookie);
  return new NextRequest(`${bridgeOrigin}/api/auth/${action}`, { method: "POST", headers, body });
}

function mockBackend(response: Response) {
  const fetch = vi.fn<(request: Request) => Promise<Response>>();
  let input: unknown;
  fetch.mockImplementation(async (request) => {
    input = await request.json();
    return response;
  });
  vi.stubGlobal("fetch", fetch);
  return { fetch, input: () => input };
}

const tokens = { data: { accessToken: "access", refreshToken: "new", role: "PARTICIPANT" } };

afterEach(() => vi.unstubAllGlobals());

it("로그인 성공 응답에 access token만 넣고 refresh token은 HttpOnly 쿠키로 저장한다", async () => {
  const backend = mockBackend(Response.json(tokens));
  const credentials = { loginId: "test-user", password: "test-pass" };
  const response = await login(authRequest("login", { body: JSON.stringify(credentials) }));

  expect(backend.input()).toEqual(credentials);
  expect(response.cookies.get("refreshToken")).toMatchObject({ value: "new", httpOnly: true, sameSite: "lax" });
  await expect(response.json()).resolves.toEqual({ data: { accessToken: "access" } });
});

it("로그인 필드 검증을 백엔드에 맡기고 400 응답을 전달한다", async () => {
  const error = {
    message: "입력값이 올바르지 않습니다.",
    errors: [{ field: "loginId", reason: "must not be blank" }],
  };
  const backend = mockBackend(Response.json(error, { status: 400 }));
  const input = { loginId: "" };
  const response = await login(authRequest("login", { body: JSON.stringify(input) }));

  expect(backend.input()).toEqual(input);
  expect(response.status).toBe(400);
  await expect(response.json()).resolves.toEqual(error);
});

it("백엔드 500의 상태와 본문을 전달한다", async () => {
  const error = { message: "서버 내부 오류가 발생했습니다." };
  mockBackend(Response.json(error, { status: 500 }));
  const response = await refresh(authRequest("refresh", { cookie: "refreshToken=old" }));

  expect(response.status).toBe(500);
  expect(response.headers.get("set-cookie")).toBeNull();
  await expect(response.json()).resolves.toEqual(error);
});

it("파싱할 수 없는 로그인 JSON은 백엔드 호출 전에 400을 반환한다", async () => {
  const backend = mockBackend(Response.json(tokens));
  const response = await login(authRequest("login", { body: "{" }));

  expect(response.status).toBe(400);
  expect(backend.fetch).not.toHaveBeenCalled();
});

it("쿠키에서 refresh token을 읽고 발급된 토큰으로 교체한다", async () => {
  const backend = mockBackend(Response.json(tokens));
  const response = await refresh(authRequest("refresh", { cookie: "refreshToken=old" }));

  expect(backend.input()).toEqual({ refreshToken: "old" });
  expect(response.cookies.get("refreshToken")?.value).toBe("new");
  await expect(response.json()).resolves.toEqual({ data: { accessToken: "access" } });
});

it("재발급이 401로 거부되면 쿠키가 만료된다", async () => {
  mockBackend(Response.json({ message: "토큰이 만료되었습니다." }, { status: 401 }));
  const response = await refresh(authRequest("refresh", { cookie: "refreshToken=old" }));

  expect(response.status).toBe(401);
  expect(response.cookies.get("refreshToken")).toMatchObject({
    path: "/api/auth",
    expires: new Date(0),
  });
});

it("다른 출처의 인증 요청은 백엔드에 전달하지 않는다", async () => {
  const backend = mockBackend(Response.json(tokens));
  const options = { origin: "https://other.example", cookie: "refreshToken=old" };

  expect((await login(authRequest("login", options))).status).toBe(403);
  expect((await refresh(authRequest("refresh", options))).status).toBe(403);
  expect(backend.fetch).not.toHaveBeenCalled();
});
