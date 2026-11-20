import { describe, expect, it } from "vitest";

import { getAfterLoginPath, getLoginHref } from "./login-return";

describe("getLoginHref", () => {
  it("스탬프 적립 화면이면 돌아올 경로를 담는다", () => {
    expect(getLoginHref("/stamp/collect")).toBe("/?next=%2Fstamp%2Fcollect");
  });

  it.each(["/projects", "/", undefined])("허용하지 않은 경로(%s)면 로그인 화면만 연다", (pathname) => {
    expect(getLoginHref(pathname)).toBe("/");
  });
});

describe("getAfterLoginPath", () => {
  it("허용한 경로면 그 경로로 보낸다", () => {
    expect(getAfterLoginPath("?next=%2Fstamp%2Fcollect")).toBe("/stamp/collect");
  });

  it.each([
    "",
    "?next=%2F%2Fevil.com",
    "?next=https%3A%2F%2Fevil.com",
    "?next=%2Fmypage",
    "?next=%2Fstamp%2Fcollect%3Ftoken%3Da",
  ])("허용하지 않은 값(%s)이면 타임라인으로 보낸다", (search) => {
    expect(getAfterLoginPath(search)).toBe("/timeline");
  });
});
