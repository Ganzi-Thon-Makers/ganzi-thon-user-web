import { render, screen } from "@testing-library/react";
import Link from "next/link";
import { expect, it } from "vitest";

import { AppBar } from "./AppBar";

it("내 프로젝트 ID가 있을 때만 MY 링크를 표시한다", () => {
  const { rerender } = render(
    <AppBar title="방명록" leading={<Link href="/booths">부스 목록</Link>} myProjectId={2} />,
  );

  expect(screen.getByRole("heading", { name: "방명록" })).toBeVisible();
  expect(screen.getByRole("link", { name: "부스 목록" })).toHaveAttribute("href", "/booths");
  expect(screen.getByRole("link", { name: "MY" })).toHaveAttribute("href", "/projects/2");

  rerender(<AppBar title="방명록" />);

  expect(screen.getByRole("heading", { name: "방명록" })).toBeVisible();
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
});
