import { screen, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { beforeEach, expect, it, vi } from "vitest";

import type * as client from "@/shared/api/client";
import { renderWithProviders } from "@/shared/test/render";
import { ToastProvider } from "@/shared/ui/Toast";

import { collectStamp, getStampBoard } from "../api/stamp.api";
import { LuckyDrawProgress } from "../components/LuckyDrawProgress";
import { readPendingStampToken, savePendingStampToken } from "../pending-stamp-token";
import { makeStampBoard } from "../stamp.fixtures";
import { StampCollectPage } from "./StampCollectPage";

const navigation = vi.hoisted(() => ({
  searchParams: new URLSearchParams(),
  replace: vi.fn<(href: string) => void>(),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: navigation.replace }),
  useSearchParams: () => navigation.searchParams,
}));
vi.mock("../api/stamp.api");
// 로그인 이동 여부만 바꿔 끼움. HTTP 동작은 stamp.api mock이 맡음
const loginRedirect = vi.hoisted(() => ({ isPending: false }));
vi.mock("@/shared/api/client", async (importOriginal) => ({
  ...(await importOriginal<typeof client>()),
  isLoginRedirectPending: () => loginRedirect.isPending,
}));

// effect가 두 번 실행돼도 한 번만 적립하는지 보려고 StrictMode로 렌더
function renderPage() {
  return renderWithProviders(
    <StrictMode>
      <ToastProvider>
        <StampCollectPage />
      </ToastProvider>
    </StrictMode>,
  );
}

beforeEach(() => {
  navigation.replace.mockClear();
  vi.mocked(collectStamp).mockReset();
  sessionStorage.clear();
  loginRedirect.isPending = false;
});

it("주소의 토큰으로 스탬프를 받고, 토큰을 지운 뒤 스탬프판으로 보낸다", async () => {
  navigation.searchParams = new URLSearchParams({ token: "booth-token" });
  vi.mocked(collectStamp).mockResolvedValue({ status: "collected", boothId: 3, luckyDrawJustEntered: false });

  renderPage();

  expect(await screen.findByText("스탬프를 받았어요!")).toBeInTheDocument();
  expect(collectStamp).toHaveBeenCalledTimes(1);
  // 토큰을 주소에서 먼저 지운 뒤 적립 요청
  expect(navigation.replace).toHaveBeenNthCalledWith(1, "/stamp/collect");
  expect(navigation.replace.mock.invocationCallOrder[0]).toBeLessThan(
    vi.mocked(collectStamp).mock.invocationCallOrder[0],
  );
  expect(navigation.replace).toHaveBeenLastCalledWith(expect.stringMatching(/^\/stamp\?stampedBooth=3&stampedAt=\d+$/));
});

it("토큰이 없으면 인식 실패를 알리고 스탬프판으로 보낸다", async () => {
  navigation.searchParams = new URLSearchParams();

  renderPage();

  expect(await screen.findByText("QR 코드를 인식 못했어요. 다시 스캔해 주세요.")).toBeInTheDocument();
  await waitFor(() => expect(navigation.replace).toHaveBeenLastCalledWith("/stamp"));
  expect(collectStamp).not.toHaveBeenCalled();
});

it("로그인 전에 찍어 보관한 토큰으로 로그인 뒤 스탬프를 받고 보관한 토큰을 지운다", async () => {
  navigation.searchParams = new URLSearchParams();
  savePendingStampToken("saved-token");
  vi.mocked(collectStamp).mockResolvedValue({ status: "collected", boothId: 3, luckyDrawJustEntered: false });

  renderPage();

  expect(await screen.findByText("스탬프를 받았어요!")).toBeInTheDocument();
  expect(collectStamp).toHaveBeenCalledTimes(1);
  expect(vi.mocked(collectStamp).mock.calls[0]?.[0]).toBe("saved-token");
  expect(readPendingStampToken()).toBeNull();
});

it("로그인이 풀려 로그인 화면으로 가는 중이면 실패 안내·이동 없이 토큰을 남긴다", async () => {
  navigation.searchParams = new URLSearchParams({ token: "booth-token" });
  loginRedirect.isPending = true;
  vi.mocked(collectStamp).mockRejectedValue(new Error("401"));

  renderPage();

  await waitFor(() => expect(collectStamp).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(readPendingStampToken()).toBe("booth-token"));
  expect(screen.queryByText("스탬프를 받지 못했어요. 잠시 후 다시 시도해 주세요.")).not.toBeInTheDocument();
  expect(navigation.replace).toHaveBeenCalledExactlyOnceWith("/stamp/collect");
});

it("적립 요청이 실패하면 실패를 알리고 스탬프판으로 보낸다", async () => {
  navigation.searchParams = new URLSearchParams({ token: "booth-token" });
  vi.mocked(collectStamp).mockRejectedValue(new Error("500"));

  renderPage();

  expect(await screen.findByText("스탬프를 받지 못했어요. 잠시 후 다시 시도해 주세요.")).toBeInTheDocument();
  await waitFor(() => expect(navigation.replace).toHaveBeenLastCalledWith("/stamp"));
  expect(readPendingStampToken()).toBeNull();
});

it("서버가 토큰을 받지 않으면(만료) 보관한 토큰을 지운다", async () => {
  navigation.searchParams = new URLSearchParams();
  savePendingStampToken("expired-token");
  vi.mocked(collectStamp).mockResolvedValue({ status: "expired" });

  renderPage();

  expect(await screen.findByText("QR 코드를 인식 못했어요. 다시 스캔해 주세요.")).toBeInTheDocument();
  expect(readPendingStampToken()).toBeNull();
});

it("기본 카메라로 처음 응모하면 이동한 스탬프판에서 안내를 보여준다", async () => {
  navigation.searchParams = new URLSearchParams({ token: "booth-token" });
  vi.mocked(collectStamp).mockResolvedValue({ status: "collected", boothId: 3, luckyDrawJustEntered: true });
  vi.mocked(getStampBoard).mockResolvedValue(makeStampBoard({ collectedCount: 15 }));
  const collectView = renderPage();

  expect(await screen.findByText("스탬프를 받았어요!")).toBeInTheDocument();
  const href = navigation.replace.mock.calls.at(-1)?.[0];
  expect(href).toMatch(/^\/stamp\?stampedBooth=3&stampedAt=\d+$/);
  navigation.searchParams = new URL(href ?? "", "https://ganzithon.com").searchParams;
  collectView.unmount();
  renderWithProviders(<LuckyDrawProgress />);

  expect(await screen.findByRole("dialog", { name: "럭키드로우 자동 응모되었습니다!" })).toBeInTheDocument();
});
