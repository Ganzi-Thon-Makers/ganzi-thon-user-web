import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { ProjectDetailSummary } from "./ProjectDetailSummary";

it("서비스 이름·썸네일·팀 이름·서비스 형태·한 줄 소개를 보여준다", () => {
  render(
    <ProjectDetailSummary
      thumbnailSrc="/thumbnail.png"
      name="Framey"
      teamName="간지팀"
      summary="사진 프레임 서비스"
      platform="WEB"
    />,
  );

  expect(screen.getByRole("heading", { name: "Framey" })).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "Framey 썸네일" })).toBeInTheDocument();
  expect(screen.getByText("간지팀")).toBeInTheDocument();
  expect(screen.getByText("WEB")).toBeInTheDocument();
  expect(screen.getByText("사진 프레임 서비스")).toBeInTheDocument();
});
