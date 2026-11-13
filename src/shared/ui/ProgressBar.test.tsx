import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { ProgressBar } from "./ProgressBar";

it("현재 값과 최댓값을 progressbar로 알려준다", () => {
  render(<ProgressBar aria-label="스탬프 진행률" value={3} max={10} />);

  const progressbar = screen.getByRole("progressbar", { name: "스탬프 진행률" });
  expect(progressbar).toHaveAttribute("aria-valuenow", "3");
  expect(progressbar).toHaveAttribute("aria-valuemax", "10");
});
