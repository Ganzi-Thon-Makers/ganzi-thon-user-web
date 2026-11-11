import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";

import { Tooltip } from "./Tooltip";

it("트리거를 눌러 설명을 열고 바깥을 누르면 닫는다", async () => {
  const user = userEvent.setup();
  render(
    <>
      <Tooltip trigger={<button type="button">안내</button>}>스탬프 안내 문구</Tooltip>
      <button type="button">다른 동작</button>
    </>,
  );

  await user.click(screen.getByRole("button", { name: "안내" }));
  expect(screen.getByText("스탬프 안내 문구")).toBeVisible();

  await user.click(screen.getByRole("button", { name: "다른 동작" }));
  expect(screen.queryByText("스탬프 안내 문구")).not.toBeInTheDocument();
});
