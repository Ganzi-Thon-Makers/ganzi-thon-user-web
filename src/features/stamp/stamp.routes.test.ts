import { expect, it } from "vitest";

import { getBoothMapHref } from "./stamp.routes";

it("부스 id를 쿼리로 담은 배치도 주소를 만든다", () => {
  expect(getBoothMapHref(12)).toBe("/booths?boothId=12");
});
