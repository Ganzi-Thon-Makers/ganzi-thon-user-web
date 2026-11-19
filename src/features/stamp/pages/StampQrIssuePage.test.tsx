import { act, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/shared/test/render";
import { ToastProvider } from "@/shared/ui/Toast";

import { getOperatorBooth, issueStampToken } from "../api/stamp.api";
import { StampQrIssuePage } from "./StampQrIssuePage";

vi.mock("../api/stamp.api");

const TTL_SECONDS = 60;

function toLocalDateTime(date: Date) {
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 19);
}

function tokenExpiringIn(seconds: number, token: string) {
  return { token, expiresAt: toLocalDateTime(new Date(Date.now() + seconds * 1000)) };
}

async function renderIssuedPage() {
  vi.mocked(issueStampToken).mockImplementation(async () => tokenExpiringIn(TTL_SECONDS, "token"));
  renderWithProviders(
    <ToastProvider>
      <StampQrIssuePage />
    </ToastProvider>,
  );
  await clickIssue();
  await expectFreshTimer();
}

async function clickIssue() {
  const issueButton = await screen.findByRole("button", { name: "스탬프 QR 발급" });
  await act(async () => issueButton.click());
}

async function expectFreshTimer() {
  await waitFor(() => expect(screen.getByRole("timer")).toHaveTextContent("01:00"));
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(new Date(2026, 10, 21, 13, 0, 0));
  vi.mocked(getOperatorBooth).mockResolvedValue({ boothId: 5, serviceName: "5팀 서비스" });
});

afterEach(() => {
  vi.useRealTimers();
  vi.resetAllMocks();
});

it("QR이 만료되면 새 QR을 자동으로 발급한다", async () => {
  await renderIssuedPage();

  await act(async () => vi.advanceTimersByTime(TTL_SECONDS * 1000));

  expect(issueStampToken).toHaveBeenCalledTimes(2);
  await expectFreshTimer();
  expect(screen.queryByText("QR 코드가 만료됐어요. 다시 발급해 주세요.")).not.toBeInTheDocument();
});

it("자동 발급이 실패하면 만료 안내를 보이고 다시 자동 발급하지 않는다", async () => {
  await renderIssuedPage();
  vi.mocked(issueStampToken).mockRejectedValue(new Error("network"));

  await act(async () => vi.advanceTimersByTime(TTL_SECONDS * 1000));

  expect(await screen.findByText("QR 코드가 만료됐어요. 다시 발급해 주세요.")).toBeInTheDocument();
  expect(screen.getByText("QR 코드를 발급하지 못했어요. 다시 시도해 주세요.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "스탬프 QR 발급" })).toBeEnabled();

  await act(async () => vi.advanceTimersByTime(TTL_SECONDS * 1000));
  expect(issueStampToken).toHaveBeenCalledTimes(2);
});

it("자동 발급이 실패한 뒤 직접 발급하면 다시 자동으로 교체한다", async () => {
  await renderIssuedPage();
  vi.mocked(issueStampToken).mockRejectedValueOnce(new Error("network"));
  await act(async () => vi.advanceTimersByTime(TTL_SECONDS * 1000));
  await screen.findByText("QR 코드가 만료됐어요. 다시 발급해 주세요.");

  await clickIssue();
  await expectFreshTimer();
  await act(async () => vi.advanceTimersByTime(TTL_SECONDS * 1000));

  expect(issueStampToken).toHaveBeenCalledTimes(4);
  await expectFreshTimer();
});

it("받을 때부터 만료된 QR은 자동으로 다시 발급하지 않는다", async () => {
  await renderIssuedPage();
  vi.mocked(issueStampToken).mockImplementation(async () => tokenExpiringIn(-30, "stale"));

  await act(async () => vi.advanceTimersByTime(TTL_SECONDS * 1000));
  expect(await screen.findByText("QR 코드가 만료됐어요. 다시 발급해 주세요.")).toBeInTheDocument();
  await act(async () => vi.advanceTimersByTime(TTL_SECONDS * 1000));

  expect(issueStampToken).toHaveBeenCalledTimes(2);
});
