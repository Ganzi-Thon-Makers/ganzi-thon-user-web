import { screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";

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

beforeEach(() => {
  clearAccessToken();
  replace.mockClear();
});

it.each([
  ["TEAM", "/operator/qr"],
  ["PARTICIPANT", "/timeline"],
  ["ADMIN", "/timeline"],
])("%s 계정은 로그인하면 %s로 이동한다", async (role, path) => {
  vi.mocked(login).mockResolvedValue({ accessToken: accessTokenFor(role) });
  const { user } = renderWithProviders(<LoginForm />);

  await user.type(screen.getByLabelText("아이디"), "id");
  await user.type(screen.getByLabelText("비밀번호"), "pw");
  await user.click(screen.getByRole("button", { name: "로그인" }));

  await waitFor(() => expect(replace).toHaveBeenCalledWith(path));
});
