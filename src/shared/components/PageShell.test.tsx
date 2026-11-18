import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { PageShell } from "./PageShell";

it("header·footer slot을 본문과 함께 렌더한다", () => {
  render(
    <PageShell header={<h1>프로젝트</h1>} footer={<button type="button">인기투표</button>}>
      <p>본문</p>
    </PageShell>,
  );

  expect(screen.getByRole("heading", { name: "프로젝트" })).toBeVisible();
  expect(screen.getByText("본문")).toBeVisible();
  expect(screen.getByRole("button", { name: "인기투표" })).toBeVisible();
});

it("header·footer를 생략하면 본문만 렌더한다", () => {
  render(
    <PageShell>
      <p>본문</p>
    </PageShell>,
  );

  expect(screen.getByText("본문")).toBeVisible();
  expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
