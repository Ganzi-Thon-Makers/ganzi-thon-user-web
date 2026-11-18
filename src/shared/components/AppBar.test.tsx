import { render, screen } from "@testing-library/react";
import Link from "next/link";
import { expect, it } from "vitest";

import { AppBar } from "./AppBar";

it("withProfile이 켜졌을 때만 프로필 링크를 표시한다", () => {
  const { rerender } = render(<AppBar title="방명록" leading={<Link href="/booths">부스 목록</Link>} withProfile />);

  expect(screen.getByRole("heading", { name: "방명록" })).toBeVisible();
  expect(screen.getByRole("link", { name: "부스 목록" })).toHaveAttribute("href", "/booths");
  expect(screen.getByRole("link", { name: "MY" })).toHaveAttribute("href", "/mypage");

  rerender(<AppBar title="방명록" />);

  expect(screen.getByRole("heading", { name: "방명록" })).toBeVisible();
  expect(screen.queryByRole("link")).not.toBeInTheDocument();

  rerender(<AppBar title="방명록" withProfile={false} />);

  expect(screen.queryByRole("link", { name: "MY" })).not.toBeInTheDocument();
});
