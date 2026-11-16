import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";

import { CollapsiblePanel, CollapsibleRoot, CollapsibleTrigger } from "./Collapsible";

it("트리거를 누르면 패널을 펼치고 다시 누르면 접는다", async () => {
  const user = userEvent.setup();
  render(
    <CollapsibleRoot>
      <CollapsibleTrigger>참가자 입장</CollapsibleTrigger>
      <CollapsiblePanel>출석 체크와 명찰 수령</CollapsiblePanel>
    </CollapsibleRoot>,
  );

  const trigger = screen.getByRole("button", { name: "참가자 입장" });
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(screen.queryByText("출석 체크와 명찰 수령")).not.toBeInTheDocument();

  await user.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByText("출석 체크와 명찰 수령")).toBeVisible();

  await user.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "false");
});
