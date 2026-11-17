import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { MouseEventHandler } from "react";
import { describe, expect, it, vi } from "vitest";

import { ButtonLink } from "./ButtonLink";

describe("ButtonLink", () => {
  it("링크 이름과 이동 경로를 전달한다", () => {
    render(<ButtonLink href="/projects">프로젝트 목록</ButtonLink>);

    expect(screen.getByRole("link", { name: "프로젝트 목록" })).toHaveAttribute("href", "/projects");
  });

  it("키보드로 링크를 활성화하면 onClick을 호출한다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn<MouseEventHandler<HTMLAnchorElement>>((event) => event.preventDefault());
    render(
      <ButtonLink href="/projects" onClick={onClick}>
        프로젝트 목록
      </ButtonLink>,
    );

    await user.tab();
    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledOnce();
  });

  it.each([
    ["기본", undefined, "bg-primary"],
    ["primary", "primary", "bg-primary"],
    ["secondary", "secondary", "bg-gray700"],
  ] as const)("%s 스타일을 링크에 적용한다", (_label, variant, backgroundClass) => {
    render(
      <ButtonLink href="/projects" variant={variant}>
        프로젝트 목록
      </ButtonLink>,
    );

    expect(screen.getByRole("link", { name: "프로젝트 목록" })).toHaveClass(backgroundClass);
  });

  it("className의 배경 스타일이 variant 배경 스타일보다 우선한다", () => {
    render(
      <ButtonLink href="/projects" variant="secondary" className="bg-primary">
        프로젝트 목록
      </ButtonLink>,
    );

    const link = screen.getByRole("link", { name: "프로젝트 목록" });
    expect(link).toHaveClass("bg-primary");
    expect(link).not.toHaveClass("bg-gray700");
  });
});
