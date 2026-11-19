import { screen, within } from "@testing-library/react";
import { compile } from "tailwindcss";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PageBoundary } from "@/shared/components/PageBoundary";
import { renderWithProviders } from "@/shared/test/render";
import { ToastProvider } from "@/shared/ui/Toast";

import { getMyPage } from "../api/mypage.api";
import type { MyPageResponse } from "../types";
import { MyPage } from "./MyPage";

vi.mock("../api/mypage.api");
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn<(path: string) => void>() }) }));

const myPageResponse: MyPageResponse = {
  userId: 1,
  name: "사용자 이름",
  loginId: "ganzi",
  teamNumber: 3,
  teamMemberList: [
    { name: "앱 팀원", part: "APP" },
    { name: "서버 팀원", part: "SERVER" },
    { name: "웹 팀원", part: "WEB" },
    { name: "기획 팀원", part: "PLAN" },
    { name: "디자인 팀원", part: "DESIGN" },
  ],
};

describe("MyPage", () => {
  beforeEach(() => {
    vi.mocked(getMyPage).mockReset().mockResolvedValue(myPageResponse);
  });

  it("정보를 불러오는 동안 스탬프 링크를 표시하고 응답을 받으면 프로필과 팀원을 보여준다", async () => {
    const { promise, resolve } = Promise.withResolvers<MyPageResponse>();
    vi.mocked(getMyPage).mockReturnValueOnce(promise);
    // jsdom에서 스켈레톤 가시성을 확인하기 위해 Tailwind 유틸리티 로드
    const { build } = await compile("@tailwind utilities;");
    const loadingVisibilityCss = build(["hidden", "peer-data-mypage-detail-pending:block"]);
    renderWithProviders(
      <>
        <style>{loadingVisibilityCss}</style>
        <MyPage />
      </>,
      { wrapper: ToastProvider },
    );

    expect(screen.getByRole("status")).toHaveTextContent("마이페이지 정보를 불러오는 중");
    expect(screen.getByRole("link", { name: "모은스탬프" })).toBeInTheDocument();
    resolve(myPageResponse);

    expect(await screen.findByText("사용자 이름")).toBeInTheDocument();
    expect(screen.getByText("ID : ganzi")).toBeInTheDocument();

    const team = within(screen.getByRole("region", { name: "팀 정보" }));
    expect(team.getByText("3팀")).toBeInTheDocument();
    expect(team.getAllByRole("term").map((part) => part.textContent)).toEqual([
      "PLAN",
      "DESIGN",
      "WEB",
      "SERVER",
      "APP",
    ]);
    expect(team.getByText("웹 팀원")).toBeInTheDocument();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("조회에 실패하면 페이지에서 다시 시도할 수 있다", async () => {
    vi.mocked(getMyPage).mockRejectedValueOnce(new Error("조회 실패"));

    const { user } = renderWithProviders(
      <PageBoundary clientOnly={false}>
        <MyPage />
      </PageBoundary>,
      { wrapper: ToastProvider },
    );

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "다시 시도" }));
    expect(await screen.findByText("사용자 이름")).toBeInTheDocument();
  });

  it("투표내역과 모은스탬프를 각 화면으로 연결한다", () => {
    renderWithProviders(<MyPage />, { wrapper: ToastProvider });

    expect(screen.getByRole("link", { name: "투표내역" })).toHaveAttribute("href", "/projects");
    expect(screen.getByRole("link", { name: "모은스탬프" })).toHaveAttribute("href", "/stamp");
  });
});
