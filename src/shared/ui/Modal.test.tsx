import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";
import {
  ModalBackdrop,
  ModalClose,
  ModalDescription,
  ModalPopup,
  ModalPortal,
  ModalRoot,
  ModalTitle,
  ModalTrigger,
} from "./Modal";

describe("Modal", () => {
  it("트리거로 열고 닫기 버튼을 누르면 트리거에 포커스를 돌려준다", async () => {
    const user = userEvent.setup();
    render(
      <ModalRoot>
        <ModalTrigger render={<Button>열기</Button>} />
        <ModalPortal>
          <ModalBackdrop />
          <ModalPopup>
            <ModalTitle>상세 정보</ModalTitle>
            <ModalDescription>선택한 항목의 상세 정보예요.</ModalDescription>
            <ModalClose render={<Button>닫기</Button>} />
          </ModalPopup>
        </ModalPortal>
      </ModalRoot>,
    );

    const trigger = screen.getByRole("button", { name: "열기" });
    await user.click(trigger);

    const modal = await screen.findByRole("dialog", { name: "상세 정보" });
    expect(modal).toHaveAccessibleDescription("선택한 항목의 상세 정보예요.");

    await user.click(screen.getByRole("button", { name: "닫기" }));
    await waitFor(() => {
      expect(modal).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it("Escape로 닫으면 onOpenChange에 닫힘 상태를 전달한다", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn<(open: boolean) => void>();
    render(
      <ModalRoot defaultOpen onOpenChange={onOpenChange}>
        <ModalPortal>
          <ModalPopup>
            <ModalTitle>상세 정보</ModalTitle>
          </ModalPopup>
        </ModalPortal>
      </ModalRoot>,
    );

    await screen.findByRole("dialog", { name: "상세 정보" });
    await user.keyboard("{Escape}");

    expect(onOpenChange.mock.calls.map(([open]) => open)).toEqual([false]);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
