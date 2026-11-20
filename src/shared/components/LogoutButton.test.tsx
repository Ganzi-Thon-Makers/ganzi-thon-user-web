import { screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";

import { logout } from "@/shared/api/session.api";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/shared/api/token";
import { getQueryClient } from "@/shared/lib/query-client";
import { renderWithProviders } from "@/shared/test/render";
import { ToastProvider } from "@/shared/ui/Toast";

import { LogoutButton } from "./LogoutButton";

const { replace } = vi.hoisted(() => ({ replace: vi.fn<(path: string) => void>() }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));
vi.mock("@/shared/api/session.api", () => ({ logout: vi.fn<() => Promise<void>>() }));

const sessionQueryKey = ["session-test"];

beforeEach(() => {
  clearAccessToken();
  replace.mockClear();
  vi.mocked(logout).mockReset();
});

it("요청 중에는 버튼을 막고 성공하면 세션을 비운 뒤 로그인 화면으로 이동한다", async () => {
  const pending = Promise.withResolvers<void>();
  vi.mocked(logout).mockReturnValueOnce(pending.promise);
  setAccessToken("access");
  const queryClient = getQueryClient();
  queryClient.setQueryData(sessionQueryKey, "private-data");

  const { user } = renderWithProviders(<LogoutButton />, { wrapper: ToastProvider });
  const button = screen.getByRole("button", { name: "로그아웃" });
  await user.click(button);

  expect(logout).toHaveBeenCalledTimes(1);
  expect(button).toBeDisabled();
  expect(getAccessToken()).toBe("access");
  pending.resolve();

  await waitFor(() => expect(replace).toHaveBeenCalledExactlyOnceWith("/"));
  expect(getAccessToken()).toBeNull();
  expect(queryClient.getQueryData(sessionQueryKey)).toBeUndefined();
});

it("실패하면 세션을 보존하고 같은 버튼으로 다시 시도할 수 있다", async () => {
  vi.mocked(logout).mockRejectedValueOnce(new Error()).mockResolvedValueOnce(undefined);
  setAccessToken("access");

  const { user } = renderWithProviders(<LogoutButton />, { wrapper: ToastProvider });
  const button = screen.getByRole("button", { name: "로그아웃" });
  await user.click(button);

  expect(await screen.findByText("알 수 없는 오류가 발생했습니다.")).toBeInTheDocument();
  expect(getAccessToken()).toBe("access");
  expect(replace).not.toHaveBeenCalled();
  expect(button).toBeEnabled();

  await user.click(button);
  await waitFor(() => expect(replace).toHaveBeenCalledExactlyOnceWith("/"));
});
