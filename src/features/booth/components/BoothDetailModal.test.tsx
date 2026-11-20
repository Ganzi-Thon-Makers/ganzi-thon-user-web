import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";

import { ModalTrigger } from "@/shared/ui/Modal";

import type { Booth } from "../types";
import { BoothButton } from "./BoothButton";
import { BoothDetailModal } from "./BoothDetailModal";

const booth: Booth = {
  id: 1,
  title: "서비스 1",
  teamName: "104호 팀 1",
  platform: "APP",
  thumbnailUrl: "/thumbnail.webp",
  summary: "서비스를 체험해 볼 수 있어요.",
};

function renderBoothDetail() {
  render(
    <BoothDetailModal>
      <ModalTrigger render={<BoothButton />} payload={booth}>
        {booth.title}
      </ModalTrigger>
    </BoothDetailModal>,
  );
}

it("누른 부스의 정보를 표시하고 Escape로 닫으면 포커스를 버튼으로 돌려준다", async () => {
  const user = userEvent.setup();
  renderBoothDetail();
  const trigger = screen.getByRole("button", { name: booth.title });

  await user.click(trigger);

  const modal = await screen.findByRole("dialog", { name: booth.title });
  expect(within(modal).getByText(booth.teamName)).toBeInTheDocument();
  expect(within(modal).getByText(booth.platform)).toBeInTheDocument();
  expect(within(modal).getByRole("img", { name: `${booth.title} 썸네일` })).toBeInTheDocument();
  expect(modal).toHaveAccessibleDescription(booth.summary);

  await user.keyboard("{Escape}");

  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

it("닫기 버튼으로 부스 정보를 닫는다", async () => {
  const user = userEvent.setup();
  renderBoothDetail();

  await user.click(screen.getByRole("button", { name: booth.title }));

  const modal = await screen.findByRole("dialog", { name: booth.title });
  await user.click(within(modal).getByRole("button", { name: "부스 상세 닫기" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
});
