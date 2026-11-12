import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { ProjectCard } from "./ProjectCard";

it("프로젝트 이름·서비스 형태·한 줄 소개를 보여준다", () => {
  render(<ProjectCard thumbnailSrc="/thumbnail.png" name="Framey" summary="사진 프레임 서비스" platform="APP" />);

  expect(screen.getByRole("heading", { name: "Framey" })).toBeInTheDocument();
  expect(screen.getByText("APP")).toBeInTheDocument();
  expect(screen.getByText("사진 프레임 서비스")).toBeInTheDocument();
});
