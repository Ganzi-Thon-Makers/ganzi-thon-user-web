import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname } from "next/navigation";
import { describe, expect, it, vi } from "vitest";

import { BottomNavigation } from "./BottomNavigation";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn<() => string>(),
}));

describe("BottomNavigation", () => {
  it("일반 탭 링크가 각각의 경로를 가리킨다", () => {
    vi.mocked(usePathname).mockReturnValue("/timeline");
    render(<BottomNavigation />);

    expect(screen.getByRole("link", { name: "타임라인" })).toHaveAttribute("href", "/timeline");
    expect(screen.getByRole("link", { name: "부스" })).toHaveAttribute("href", "/booths");
    expect(screen.getByRole("link", { name: "프로젝트" })).toHaveAttribute("href", "/projects");
    expect(screen.getByRole("link", { name: "마이" })).toHaveAttribute("href", "/mypage");
  });

  it("스탬프 화면 밖에서는 스탬프 진입 링크를 표시한다", () => {
    vi.mocked(usePathname).mockReturnValue("/timeline");
    render(<BottomNavigation />);

    expect(screen.getByRole("link", { name: "스탬프" })).toHaveAttribute("href", "/stamp");
    expect(screen.queryByRole("button", { name: "QR" })).not.toBeInTheDocument();
  });

  it("스탬프 화면에서는 QR 버튼을 표시하고 클릭하면 onQrClick을 호출한다", async () => {
    vi.mocked(usePathname).mockReturnValue("/stamp");
    const user = userEvent.setup();
    const onQrClick = vi.fn<() => void>();
    render(<BottomNavigation onQrClick={onQrClick} />);

    expect(screen.queryByRole("link", { name: "스탬프" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "QR" }));

    expect(onQrClick).toHaveBeenCalledOnce();
  });
});
