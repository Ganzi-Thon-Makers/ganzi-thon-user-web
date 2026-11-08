import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("클릭하면 onClick이 호출된다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn<() => void>();
    render(<Button onClick={onClick}>저장</Button>);

    await user.click(screen.getByRole("button", { name: "저장" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("disabled면 클릭되지 않는다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn<() => void>();
    render(
      <Button disabled onClick={onClick}>
        저장
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "저장" }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("variant 클래스가 적용된다", () => {
    render(<Button variant="secondary">취소</Button>);

    expect(screen.getByRole("button", { name: "취소" })).toHaveClass("border");
  });
});
