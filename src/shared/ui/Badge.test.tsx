import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { Badge } from "./Badge";

it("기본 크기와 색상은 medium과 red다", () => {
  render(<Badge>WEB</Badge>);

  expect(screen.getByText("WEB")).toHaveClass("text-body-sb-14", "bg-red500", "text-white");
});

it("small 크기에 맞는 패딩과 타이포를 적용한다", () => {
  render(<Badge size="small">APP</Badge>);

  expect(screen.getByText("APP")).toHaveClass("px-2", "py-1", "text-caption-m-10");
});

it.each([
  ["red", "bg-red500", "text-white"],
  ["ivory", "bg-ivory200", "text-black"],
  ["secondary", "bg-gray700", "text-white"],
] as const)("xsmall에 %s 색상 스타일을 적용한다", (variant, background, foreground) => {
  render(
    <Badge size="xsmall" variant={variant}>
      APP
    </Badge>,
  );

  expect(screen.getByText("APP")).toHaveClass("py-0.5", background, foreground);
});
