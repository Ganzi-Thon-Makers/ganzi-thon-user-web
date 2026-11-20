import { describe, expect, it } from "vitest";

import { getLoginHref } from "@/shared/lib/login-return";

import { getBoothMapHref, getStampBoardHref, parseStampToken, STAMP_COLLECT_PATH } from "./stamp.routes";

it("부스 id를 쿼리로 담은 배치도 주소를 만든다", () => {
  expect(getBoothMapHref(12)).toBe("/booths?boothId=12");
});

it("적립한 부스 id와 적립 시각을 담은 스탬프판 주소를 만든다", () => {
  expect(getStampBoardHref(7, 1000)).toBe("/stamp?stampedBooth=7&stampedAt=1000");
});

describe("parseStampToken", () => {
  it("스탬프 적립 주소면 토큰을 꺼낸다", () => {
    expect(parseStampToken("https://ganzithon.com/stamp/collect?token=abc")).toBe("abc");
  });

  it("다른 경로의 주소면 null이다", () => {
    expect(parseStampToken("https://ganzithon.com/booths?token=abc")).toBeNull();
  });

  it("토큰이 비어 있으면 null이다", () => {
    expect(parseStampToken("https://ganzithon.com/stamp/collect?token=")).toBeNull();
  });

  it("주소가 아닌 글자면 null이다", () => {
    expect(parseStampToken("hello")).toBeNull();
  });
});

it("로그인 뒤 돌아올 수 있는 경로에 적립 화면이 들어 있다", () => {
  expect(getLoginHref(STAMP_COLLECT_PATH)).not.toBe("/");
});
