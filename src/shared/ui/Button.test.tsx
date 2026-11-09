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

  it.each([
    ["primary", "저장", "bg-primary active:bg-red600 data-disabled:bg-red300"],
    ["secondary", "취소", "bg-gray700 active:bg-gray800 data-disabled:bg-gray300"],
  ] as const)("%s variant의 클래스가 적용된다", (variant, buttonName, className) => {
    render(<Button variant={variant}>{buttonName}</Button>);

    expect(screen.getByRole("button", { name: buttonName })).toHaveClass(className);
  });
});
