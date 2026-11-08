import ky from "ky";
import { describe, expect, it } from "vitest";

import { toApiError } from "./error";

/** 실제 네트워크 없이 원하는 응답을 돌려주는 ky 인스턴스 */
function kyRespondingWith(response: Response) {
  return ky.create({ retry: 0, fetch: async () => response });
}

describe("toApiError", () => {
  it("HTTP 에러는 status와 백엔드 code·message를 담는다", async () => {
    const client = kyRespondingWith(
      Response.json({ code: "POST_NOT_FOUND", message: "게시글이 없습니다." }, { status: 404 }),
    );

    const error = await client.get("https://api.test/posts/1").catch((e: unknown) => e);

    expect(toApiError(error)).toEqual({
      status: 404,
      code: "POST_NOT_FOUND",
      message: "게시글이 없습니다.",
    });
  });

  it("에러 본문이 없으면 기본 code·message를 쓴다", async () => {
    const client = kyRespondingWith(new Response(null, { status: 500 }));

    const error = await client.get("https://api.test/posts").catch((e: unknown) => e);

    expect(toApiError(error)).toMatchObject({ status: 500, code: "HTTP_500" });
  });

  it("알 수 없는 에러는 UNKNOWN으로 바꾼다", () => {
    expect(toApiError(new Error("boom"))).toMatchObject({ status: null, code: "UNKNOWN" });
  });
});
