import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname } from "next/navigation";
import { afterEach, describe, expect, it, vi } from "vitest";

import { setAccessToken } from "../api/token";
import { BottomNavigation } from "./BottomNavigation";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn<() => string>(),
}));

function signInAs(role: string) {
  setAccessToken(`header.${Buffer.from(JSON.stringify({ role })).toString("base64url")}.signature`);
}

afterEach(() => window.localStorage.clear());

describe("BottomNavigation", () => {
  it("일반 탭 링크가 각각의 경로를 가리키고 현재 탭만 표시한다", () => {
    vi.mocked(usePathname).mockReturnValue("/timeline");
    render(<BottomNavigation />);

    expect(screen.getByRole("link", { name: "타임라인" })).toHaveAttribute("href", "/timeline");
    expect(screen.getByRole("link", { name: "부스" })).toHaveAttribute("href", "/booths");
    expect(screen.getByRole("link", { name: "프로젝트" })).toHaveAttribute("href", "/projects");
    expect(screen.getByRole("link", { name: "마이" })).toHaveAttribute("href", "/mypage");
    expect(screen.getAllByRole("link", { current: "page" })).toEqual([screen.getByRole("link", { name: "타임라인" })]);
  });

  it.each(["/timeline", "/stamp"])("QR 동작이 없으면 %s에서 스탬프 진입 링크를 표시한다", (pathname) => {
    vi.mocked(usePathname).mockReturnValue(pathname);
    render(<BottomNavigation />);

    expect(screen.getByRole("link", { name: "스탬프" })).toHaveAttribute("href", "/stamp");
    expect(screen.queryByRole("button", { name: "QR" })).not.toBeInTheDocument();
  });

  it.each(["/stamp", "/stamp/history"])(
    "QR 동작이 있으면 %s에서 버튼을 표시하고 onQrClick을 호출한다",
    async (pathname) => {
      vi.mocked(usePathname).mockReturnValue(pathname);
      const user = userEvent.setup();
      const onQrClick = vi.fn<() => void>();
      render(<BottomNavigation onQrClick={onQrClick} />);

      expect(screen.queryByRole("link", { name: "스탬프" })).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "QR" }));

      expect(onQrClick).toHaveBeenCalledOnce();
    },
  );

  it("참가자 계정이면 스탬프 진입 링크를 표시한다", () => {
    vi.mocked(usePathname).mockReturnValue("/timeline");
    signInAs("PARTICIPANT");
    render(<BottomNavigation />);

    expect(screen.getByRole("link", { name: "스탬프" })).toHaveAttribute("href", "/stamp");
  });

  it.each(["TEAM", "ADMIN", "SUPER_ADMIN"])("%s 계정이면 스탬프 링크와 QR 버튼을 숨기고 나머지 탭은 남긴다", (role) => {
    vi.mocked(usePathname).mockReturnValue("/stamp");
    signInAs(role);
    render(<BottomNavigation onQrClick={vi.fn<() => void>()} />);

    expect(screen.queryByRole("link", { name: "스탬프" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "QR" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual([
      "타임라인",
      "부스",
      "프로젝트",
      "마이",
    ]);
  });
});
