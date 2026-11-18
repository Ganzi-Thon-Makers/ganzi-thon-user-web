import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PageBoundary } from "@/shared/components/PageBoundary";
import { renderWithProviders } from "@/shared/test/render";

import { getMyPage } from "../api/mypage.api";
import { mockMyPageProfile, mockMyPageTeam } from "../api/mypage.mock";
import { MyPage } from "./MyPage";

vi.mock("../api/mypage.api", { spy: true });

describe("MyPage", () => {
  it("프로필과 팀 정보를 불러오는 동안에도 스탬프 링크를 표시한다", async () => {
    renderWithProviders(<MyPage />);

    expect(screen.getByText("마이페이지 정보를 불러오는 중")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "모은스탬프" })).toBeInTheDocument();
    expect(await screen.findByText("사용자 이름")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "팀 정보" })).toHaveTextContent("N팀");
    expect(screen.queryByText("마이페이지 정보를 불러오는 중")).not.toBeInTheDocument();
  });

  it("조회에 실패하면 페이지에서 다시 시도할 수 있다", async () => {
    const getMyPageMock = vi.mocked(getMyPage);
    getMyPageMock.mockRejectedValueOnce(new Error("조회 실패"));
    getMyPageMock.mockResolvedValueOnce({ profile: mockMyPageProfile, team: mockMyPageTeam });

    const { user } = renderWithProviders(
      <PageBoundary clientOnly={false}>
        <MyPage />
      </PageBoundary>,
    );

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "다시 시도" }));
    expect(await screen.findByText("사용자 이름")).toBeInTheDocument();
  });

  it("투표내역과 모은스탬프를 각 화면으로 연결한다", () => {
    renderWithProviders(<MyPage />);

    expect(screen.getByRole("link", { name: "투표내역" })).toHaveAttribute("href", "/projects");
    expect(screen.getByRole("link", { name: "모은스탬프" })).toHaveAttribute("href", "/stamp");
  });

  it("연결 전인 로그아웃을 비활성 버튼으로 표시한다", () => {
    renderWithProviders(<MyPage />);

    expect(screen.getByRole("button", { name: "로그아웃" })).toBeDisabled();
  });
});
