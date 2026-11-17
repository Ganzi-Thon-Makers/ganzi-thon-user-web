import { describe, expect, it } from "vitest";

import { collectStamp, getMyStamps } from "./stamp.api";
import { createMockStampToken } from "./stamp.mock";

describe("stamp api (mock)", () => {
  it("새 부스 토큰이면 스탬프를 받고 내 스탬프 목록에 추가한다", async () => {
    const before = await getMyStamps();

    await expect(collectStamp(createMockStampToken(2))).resolves.toEqual({ status: "collected", boothId: 2 });
    expect(await getMyStamps()).toHaveLength(before.length + 1);
  });

  it("이미 받은 부스 토큰이면 다시 받지 않고 이미 받았다고 알린다", async () => {
    const before = await getMyStamps();

    await expect(collectStamp(createMockStampToken(1))).resolves.toEqual({ status: "already-collected", boothId: 1 });
    expect(await getMyStamps()).toHaveLength(before.length);
  });

  it("형식이 맞지 않는 토큰이면 잘못된 토큰으로 알린다", async () => {
    await expect(collectStamp("expired-token")).resolves.toEqual({ status: "invalid-token" });
  });

  it("스탬프판에 없는 부스 토큰이면 잘못된 토큰으로 알린다", async () => {
    await expect(collectStamp(createMockStampToken(999))).resolves.toEqual({ status: "invalid-token" });
  });
});
