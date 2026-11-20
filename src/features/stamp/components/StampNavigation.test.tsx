import { act, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/shared/test/render";
import { ToastProvider } from "@/shared/ui/Toast";

import { type CollectStampResult, collectStamp, getStampBoard } from "../api/stamp.api";
import { makeStampBoard } from "../stamp.fixtures";
import { LuckyDrawProgress } from "./LuckyDrawProgress";
import { StampNavigation } from "./StampNavigation";

const scanner = vi.hoisted(() => ({
  onDecode: null as ((result: { data: string }) => Promise<void>) | null,
  start: vi.fn<() => Promise<void>>(),
  destroy: vi.fn<() => void>(),
}));

vi.mock("qr-scanner", () => ({
  default: class {
    constructor(_video: HTMLVideoElement, onDecode: (result: { data: string }) => Promise<void>) {
      scanner.onDecode = onDecode;
    }
    start = scanner.start;
    destroy = scanner.destroy;
  },
}));

const router = vi.hoisted(() => ({ replace: vi.fn<(href: string) => void>(), searchParams: new URLSearchParams() }));
vi.mock("next/navigation", () => ({
  useRouter: () => router,
  usePathname: () => "/stamp",
  useSearchParams: () => router.searchParams,
}));
vi.mock("../api/stamp.api");

const STAMP_URL = "https://ganzithon.com/stamp/collect?token=booth-token";

beforeEach(() => {
  scanner.onDecode = null;
  scanner.start.mockResolvedValue();
  router.replace.mockClear();
  router.searchParams = new URLSearchParams();
  scanner.destroy.mockClear();
  vi.useRealTimers();
});

async function openScanner() {
  const view = renderWithProviders(
    <ToastProvider>
      <StampNavigation />
    </ToastProvider>,
  );
  await view.user.click(screen.getByRole("button", { name: "QR" }));
  await screen.findByRole("dialog", { name: "스탬프 QR 스캔" });
  await waitFor(() => expect(scanner.onDecode).not.toBeNull());
  return view;
}

async function scan(text: string) {
  await act(async () => {
    await scanner.onDecode?.({ data: text });
  });
}

it("스탬프 QR을 인식하면 적립하고 모달을 닫은 뒤 그 부스 구역을 펼친 스탬프판으로 보낸다", async () => {
  vi.mocked(collectStamp).mockResolvedValue({
    status: "collected",
    boothId: 4,
    collectedCount: 1,
    luckyDrawEntered: false,
    luckyDrawJustEntered: false,
  });
  await openScanner();

  await scan(STAMP_URL);

  expect(collectStamp).toHaveBeenCalledWith("booth-token", expect.anything());
  expect(await screen.findByText("스탬프를 받았어요!")).toBeInTheDocument();
  expect(router.replace).toHaveBeenCalledWith(expect.stringMatching(/^\/stamp\?stampedBooth=4&stampedAt=\d+$/));
  await waitFor(() => expect(screen.queryByRole("dialog", { name: "스탬프 QR 스캔" })).not.toBeInTheDocument());
});

it("이미 받은 부스 QR이면 이미 수집했다고 알리고 그 구역을 펼친다", async () => {
  vi.mocked(collectStamp).mockResolvedValue({
    status: "already-collected",
    boothId: 2,
    collectedCount: 1,
    luckyDrawEntered: false,
    luckyDrawJustEntered: false,
  });
  await openScanner();

  await scan(STAMP_URL);

  expect(await screen.findByText("이미 수집한 스탬프입니다.")).toBeInTheDocument();
  expect(router.replace).toHaveBeenCalledWith(expect.stringMatching(/^\/stamp\?stampedBooth=2&stampedAt=\d+$/));
});

it("스탬프 QR이 아니면 적립하지 않고 모달을 연 채로 다시 스캔하게 안내한다", async () => {
  await openScanner();

  await scan("https://example.com/other");

  expect(collectStamp).not.toHaveBeenCalled();
  expect(await screen.findByText("QR 코드를 인식 못했어요. 다시 스캔해 주세요.")).toBeInTheDocument();
  expect(screen.getByRole("dialog", { name: "스탬프 QR 스캔" })).toBeInTheDocument();
});

it("카메라를 켜지 못하면 모달을 닫고 안내한다", async () => {
  scanner.start.mockRejectedValue(new Error("NotAllowedError"));
  const view = renderWithProviders(
    <ToastProvider>
      <StampNavigation />
    </ToastProvider>,
  );

  await view.user.click(screen.getByRole("button", { name: "QR" }));

  expect(await screen.findByText("카메라를 켜지 못했어요. 카메라 권한을 확인해 주세요.")).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByRole("dialog", { name: "스탬프 QR 스캔" })).not.toBeInTheDocument());
});

it("인식에 실패하면 잠시 쉬었다가 다시 인식한다", async () => {
  await openScanner();
  vi.useFakeTimers({ shouldAdvanceTime: true });

  await scan("not-a-stamp-qr");
  await scan(STAMP_URL);
  expect(collectStamp).not.toHaveBeenCalled();

  vi.mocked(collectStamp).mockResolvedValue({
    status: "collected",
    boothId: 1,
    collectedCount: 1,
    luckyDrawEntered: false,
    luckyDrawJustEntered: false,
  });
  await act(async () => {
    vi.advanceTimersByTime(1500);
  });
  await scan(STAMP_URL);
  expect(collectStamp).toHaveBeenCalledTimes(1);
});

it("적립 응답 전에 모달을 닫으면 응답이 와도 스탬프판으로 이동하지 않는다", async () => {
  const response = { resolve: (_result: CollectStampResult) => {} };
  vi.mocked(collectStamp).mockReturnValue(
    new Promise((resolve) => {
      response.resolve = resolve;
    }),
  );
  const { user } = await openScanner();

  const pendingScan = scanner.onDecode?.({ data: STAMP_URL });
  await user.click(screen.getByRole("button", { name: "닫기" }));
  await act(async () => {
    response.resolve({
      status: "collected",
      boothId: 4,
      collectedCount: 1,
      luckyDrawEntered: false,
      luckyDrawJustEntered: false,
    });
    await pendingScan;
  });

  expect(router.replace).not.toHaveBeenCalled();
});

it("모달을 닫으면 카메라를 끈다", async () => {
  const { user } = await openScanner();

  await user.click(screen.getByRole("button", { name: "닫기" }));

  await waitFor(() => expect(scanner.destroy).toHaveBeenCalled());
});

it("같은 만료 QR은 안내가 닫힌 뒤 다시 표시하고 적립을 재요청하지 않는다", async () => {
  vi.mocked(collectStamp).mockResolvedValue({ status: "expired" });
  const { user } = await openScanner();
  vi.useFakeTimers({ shouldAdvanceTime: true });

  await scan(STAMP_URL);
  expect(
    await screen.findByText("만료된 QR 코드예요. 부스 운영자에게 새 QR 발급을 요청해 주세요."),
  ).toBeInTheDocument();
  await act(async () => {
    vi.advanceTimersByTime(1500);
  });
  await scan(STAMP_URL);
  const notice = "만료된 QR 코드예요. 부스 운영자에게 새 QR 발급을 요청해 주세요.";
  expect(screen.getAllByText(notice)).toHaveLength(1);
  await act(async () => {
    await vi.advanceTimersByTimeAsync(3700);
  });
  expect(screen.queryByText(notice)).not.toBeInTheDocument();

  await scan(STAMP_URL);
  expect(await screen.findByText(notice)).toBeInTheDocument();
  expect(collectStamp).toHaveBeenCalledTimes(1);
  expect(screen.queryByText("QR 코드를 인식 못했어요. 다시 스캔해 주세요.")).not.toBeInTheDocument();

  vi.useRealTimers();
  await user.click(screen.getByRole("button", { name: "닫기" }));
  await user.click(screen.getByRole("button", { name: "QR" }));
  await waitFor(() => expect(scanner.onDecode).not.toBeNull());
  await scan(STAMP_URL);
  expect(collectStamp).toHaveBeenCalledTimes(2);
});

it("연속 적립 제한에 걸리면 안내하고 모달을 닫는다", async () => {
  vi.mocked(collectStamp).mockResolvedValue({ status: "cooldown" });
  await openScanner();

  await scan(STAMP_URL);

  expect(
    await screen.findByText("스탬프는 5분에 한 번 받을 수 있어요. 잠시 후 다시 스캔해 주세요."),
  ).toBeInTheDocument();
  expect(router.replace).toHaveBeenCalledWith("/stamp");
  await waitFor(() => expect(screen.queryByRole("dialog", { name: "스탬프 QR 스캔" })).not.toBeInTheDocument());
});

it("앱 스캔으로 처음 응모하면 이동한 스탬프판에서 안내를 보여준다", async () => {
  vi.mocked(collectStamp).mockResolvedValue({
    status: "collected",
    boothId: 4,
    collectedCount: 15,
    luckyDrawEntered: true,
    luckyDrawJustEntered: true,
  });
  vi.mocked(getStampBoard).mockResolvedValue(makeStampBoard({ collectedCount: 15 }));
  const scannerView = await openScanner();

  await scan(STAMP_URL);
  const href = router.replace.mock.calls.at(-1)?.[0];
  expect(href).toBeDefined();
  router.searchParams = new URL(href ?? "", STAMP_URL).searchParams;
  scannerView.unmount();
  renderWithProviders(<LuckyDrawProgress />);

  expect(await screen.findByRole("dialog", { name: "럭키드로우 자동 응모되었습니다!" })).toBeInTheDocument();
});

it("서버에 존재하지 않는 QR은 인식 실패로 안내한다", async () => {
  vi.mocked(collectStamp).mockResolvedValue({ status: "invalid-token" });
  await openScanner();

  await scan(STAMP_URL);

  expect(await screen.findByText("QR 코드를 인식 못했어요. 다시 스캔해 주세요.")).toBeInTheDocument();
});
