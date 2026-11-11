import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentProps, createRef } from "react";
import { expect, it, vi } from "vitest";

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

it("Popup 상태와 열림 완료 이벤트를 전달하고 actionsRef로 닫을 수 있다", async () => {
  type TooltipProps = ComponentProps<typeof Tooltip>;
  const actionsRef = createRef<NonNullable<TooltipProps["actionsRef"]>["current"]>();
  const onOpenChangeComplete = vi.fn<NonNullable<TooltipProps["onOpenChangeComplete"]>>();
  const user = userEvent.setup();

  render(
    <Tooltip
      trigger={<button type="button">안내</button>}
      className={(state) => (state.open ? "open-tooltip" : undefined)}
      actionsRef={actionsRef}
      onOpenChangeComplete={onOpenChangeComplete}
    >
      스탬프 안내 문구
    </Tooltip>,
  );

  await user.click(screen.getByRole("button", { name: "안내" }));
  expect(screen.getByRole("dialog")).toHaveClass("open-tooltip");
  expect(onOpenChangeComplete).toHaveBeenCalledWith(true);

  act(() => actionsRef.current?.close());
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(onOpenChangeComplete).toHaveBeenLastCalledWith(false);
});
