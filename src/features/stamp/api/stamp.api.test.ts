import { describe, expect, it } from "vitest";

import { createStamp, getMyStamps } from "./stamp.api";

describe("stamp api (mock)", () => {
  it("새 부스 스탬프를 받으면 내 스탬프 목록에 추가되고, 같은 부스는 다시 받을 수 없다", async () => {
    const before = await getMyStamps();

    const created = await createStamp(2);
    expect(created.boothId).toBe(2);
    expect(await getMyStamps()).toHaveLength(before.length + 1);

    await expect(createStamp(2)).rejects.toThrow("이미 스탬프를 받은 부스입니다.");
  });
});
