import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ToastProvider, useToast } from "./Toast";

function ToastTrigger() {
  const { success, error } = useToast();

  return (
    <>
      <button type="button" onClick={() => success("투표가 완료되었습니다!")}>
        알림 표시
      </button>
      <button type="button" onClick={() => error("투표에 실패했어요.", { timeout: 1000 })}>
        오류 표시
      </button>
    </>
  );
}

describe("Toast", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("useToast에 지정한 시간이 지나면 오류 알림이 닫힌다", async () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "오류 표시" }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(999);
    });
    expect(screen.getByText("투표에 실패했어요.")).toBeVisible();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(screen.queryByText("투표에 실패했어요.")).not.toBeInTheDocument();
  });

  it("메시지를 표시하고 기본 표시 시간이 지나면 닫힌다", async () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "알림 표시" }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(4999);
    });
    expect(screen.getByText("투표가 완료되었습니다!")).toBeVisible();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(screen.queryByText("투표가 완료되었습니다!")).not.toBeInTheDocument();
  });

  it("Provider에 지정한 위치에 알림을 표시한다", () => {
    render(
      <ToastProvider position="top-center">
        <ToastTrigger />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "알림 표시" }));

    expect(screen.getByRole("region", { name: "Notifications" })).toHaveAttribute("data-position", "top-center");
    expect(screen.getByText("투표가 완료되었습니다!")).toBeVisible();
  });

  it("같은 메시지를 연달아 표시해도 각각의 표시 시간이 적용된다", async () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    );

    const trigger = screen.getByRole("button", { name: "알림 표시" });
    fireEvent.click(trigger);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(4500);
    });
    fireEvent.click(trigger);
    expect(screen.getAllByText("투표가 완료되었습니다!")).toHaveLength(2);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(600);
    });

    expect(screen.getByText("투표가 완료되었습니다!")).toBeVisible();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(4400);
    });
    expect(screen.queryByText("투표가 완료되었습니다!")).not.toBeInTheDocument();
  });
});
