import { afterEach, expect, it, vi } from "vitest";

afterEach(() => {
  localStorage.removeItem("accessToken");
  vi.unstubAllGlobals();
  vi.resetModules();
});

it("선택한 부스 ID와 인증 헤더로 상세를 조회하고 응답 data를 반환한다", async () => {
  const detail = {
    projectId: 51,
    title: "부스 프로젝트",
    teamName: "전시 팀",
    summary: "부스 프로젝트 소개",
    thumbnailUrl: "/thumbnail.webp",
    platform: "WEB",
  };
  const fetch = vi.fn<(request: Request) => Promise<Response>>().mockResolvedValue(Response.json({ data: detail }));
  vi.stubGlobal("fetch", fetch);
  const { setAccessToken } = await import("@/shared/api/token");
  const { getBoothDetail } = await import("./booth.api");
  setAccessToken("test-access-token");

  await expect(getBoothDetail(101)).resolves.toEqual(detail);

  expect(fetch).toHaveBeenCalledTimes(1);
  const [request] = fetch.mock.calls[0];
  expect(new URL(request.url).pathname).toBe("/api/v1/booth/101");
  expect(request.method).toBe("GET");
  expect(request.headers.get("Authorization")).toBe("Bearer test-access-token");
});
