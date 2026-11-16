import { describe, expect, it } from "vitest";

import { getBoothMapHref, getStampBoardHref, parseStampToken } from "./stamp.routes";

it("부스 id를 쿼리로 담은 배치도 주소를 만든다", () => {
  expect(getBoothMapHref(12)).toBe("/booths?boothId=12");
});

it("적립한 부스 id를 담은 스탬프판 주소를 만든다", () => {
  expect(getStampBoardHref(7)).toBe("/stamp?stampedBooth=7");
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
