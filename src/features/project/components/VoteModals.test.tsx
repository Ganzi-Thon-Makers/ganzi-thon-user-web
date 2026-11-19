import { act, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { VoteCompleteModal } from "./VoteModals";

afterEach(() => {
  vi.useRealTimers();
});

it("완료 모달은 2초 뒤 스스로 닫힌다", () => {
  vi.useFakeTimers();
  const onOpenChange = vi.fn<(open: boolean) => void>();
  render(<VoteCompleteModal open onOpenChange={onOpenChange} />);

  expect(screen.getByText("투표가 완료되었습니다.")).toBeInTheDocument();
  act(() => vi.advanceTimersByTime(1999));
  expect(onOpenChange).not.toHaveBeenCalled();

  act(() => vi.advanceTimersByTime(1));
  expect(onOpenChange).toHaveBeenCalledWith(false);
});

it("먼저 닫히면 자동 닫힘을 다시 부르지 않는다", () => {
  vi.useFakeTimers();
  const onOpenChange = vi.fn<(open: boolean) => void>();
  const { rerender } = render(<VoteCompleteModal open onOpenChange={onOpenChange} />);

  rerender(<VoteCompleteModal open={false} onOpenChange={onOpenChange} />);
  act(() => vi.advanceTimersByTime(2000));

  expect(onOpenChange).not.toHaveBeenCalled();
});
