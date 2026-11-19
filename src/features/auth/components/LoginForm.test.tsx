import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { clearAccessToken } from "@/shared/api/token";
import { renderWithProviders } from "@/shared/test/render";

import { login } from "../api/auth.api";
import { LoginForm } from "./LoginForm";

const { replace } = vi.hoisted(() => ({ replace: vi.fn<(path: string) => void>() }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));
vi.mock("../api/auth.api");

function accessTokenFor(role: string) {
  return `header.${Buffer.from(JSON.stringify({ role })).toString("base64url")}.signature`;
}

async function submitLoginAs(role: string) {
  vi.mocked(login).mockResolvedValue({ accessToken: accessTokenFor(role) });
  const { user } = renderWithProviders(<LoginForm />);

  await user.type(screen.getByLabelText("아이디"), "id");
  await user.type(screen.getByLabelText("비밀번호"), "pw");
  await user.click(screen.getByRole("button", { name: "로그인" }));
}

beforeEach(() => {
  clearAccessToken();
  replace.mockClear();
});

afterEach(() => {
  window.history.replaceState(null, "", "/");
});

it.each([
  ["TEAM", "/operator/qr"],
  ["PARTICIPANT", "/timeline"],
  ["ADMIN", "/timeline"],
])("%s 계정은 로그인하면 %s로 이동한다", async (role, path) => {
  await submitLoginAs(role);

  await waitFor(() => expect(replace).toHaveBeenCalledWith(path));
});

it("스탬프 QR로 들어와 로그인하면 적립 화면으로 돌아간다", async () => {
  window.history.replaceState(null, "", "/?next=%2Fstamp%2Fcollect");

  await submitLoginAs("PARTICIPANT");

  await waitFor(() => expect(replace).toHaveBeenCalledExactlyOnceWith("/stamp/collect"));
});

it("돌아갈 경로가 허용 목록에 없으면 타임라인으로 보낸다", async () => {
  window.history.replaceState(null, "", "/?next=%2F%2Fevil.com");

  await submitLoginAs("PARTICIPANT");

  await waitFor(() => expect(replace).toHaveBeenCalledExactlyOnceWith("/timeline"));
});

it("팀 계정은 돌아갈 경로가 있어도 QR 발급 화면으로 보낸다", async () => {
  window.history.replaceState(null, "", "/?next=%2Fstamp%2Fcollect");

  await submitLoginAs("TEAM");

  await waitFor(() => expect(replace).toHaveBeenCalledExactlyOnceWith("/operator/qr"));
});
