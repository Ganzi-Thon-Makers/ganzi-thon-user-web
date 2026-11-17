import { screen, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { beforeEach, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/shared/test/render";
import { ToastProvider } from "@/shared/ui/Toast";

import { collectStamp } from "../api/stamp.api";
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
});

it("주소의 토큰으로 스탬프를 받고, 토큰을 지운 뒤 스탬프판으로 보낸다", async () => {
  navigation.searchParams = new URLSearchParams({ token: "booth-token" });
  vi.mocked(collectStamp).mockResolvedValue({ status: "collected", boothId: 3 });

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
