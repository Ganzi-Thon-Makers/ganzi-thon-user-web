import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/shared/test/render";

import { login } from "../api/auth.api";
import { LoginForm } from "./LoginForm";

const replace = vi.hoisted(() => vi.fn<(href: string) => void>());
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));
vi.mock("../api/auth.api");

async function submitLogin() {
  const user = userEvent.setup();
  renderWithProviders(<LoginForm />);
  await user.type(screen.getByLabelText("아이디"), "ab1234");
  await user.type(screen.getByLabelText("비밀번호"), "ab5678");
  await user.click(screen.getByRole("button", { name: "로그인" }));
}

beforeEach(() => {
  replace.mockClear();
  vi.mocked(login).mockResolvedValue({ accessToken: "access-token" });
});

afterEach(() => {
  window.history.replaceState(null, "", "/");
  localStorage.clear();
});

it("스탬프 QR로 들어와 로그인하면 적립 화면으로 돌아간다", async () => {
  window.history.replaceState(null, "", "/?next=%2Fstamp%2Fcollect");

  await submitLogin();

  await waitFor(() => expect(replace).toHaveBeenCalledExactlyOnceWith("/stamp/collect"));
});

it("돌아갈 경로가 허용 목록에 없으면 타임라인으로 보낸다", async () => {
  window.history.replaceState(null, "", "/?next=%2F%2Fevil.com");

  await submitLogin();

  await waitFor(() => expect(replace).toHaveBeenCalledExactlyOnceWith("/timeline"));
});
