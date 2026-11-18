import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TextField } from "./TextField";

describe("TextField", () => {
  it("입력값을 화면에 표시하고 변경을 전달한다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(value: string) => void>();
    render(
      <>
        <label htmlFor="name">이름</label>
        <TextField id="name" onValueChange={onValueChange} />
      </>,
    );

    const input = screen.getByRole("textbox", { name: "이름" });
    await user.type(input, "WEB");

    expect(input).toHaveValue("WEB");
    expect(onValueChange).toHaveBeenLastCalledWith("WEB", expect.anything());
  });

  it("지정한 입력 요소에 기본 스타일과 상태별 클래스를 적용한다", () => {
    render(
      <TextField
        disabled
        render={<input placeholder="프로젝트 이름" />}
        className={({ disabled }) => (disabled ? "opacity-50" : undefined)}
      />,
    );

    const input = screen.getByPlaceholderText("프로젝트 이름");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("text-body-r-16", "opacity-50");
  });

  it("입력 오류 문구를 표시한다", () => {
    render(<TextField errorMessage="이름을 확인해 주세요." />);

    expect(screen.getByText("이름을 확인해 주세요.")).toBeVisible();
  });
});
