import { describe, expect, it } from "vitest";

import { cn } from "./cn";

describe("cn", () => {
  it("조건부 클래스를 합친다", () => {
    expect(cn("px-2", { hidden: false, block: true }, undefined, "text-sm")).toBe("px-2 block text-sm");
  });

  it("충돌하는 Tailwind 클래스는 뒤의 것이 이긴다", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});
