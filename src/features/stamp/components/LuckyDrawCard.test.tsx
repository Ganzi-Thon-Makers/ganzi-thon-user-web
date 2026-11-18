import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { LuckyDrawCard } from "./LuckyDrawCard";

it("남은 스탬프 개수와 진행률을 보여준다", () => {
  render(<LuckyDrawCard collectedCount={5} goalCount={20} />);

  expect(screen.getByText("15개")).toBeInTheDocument();
  expect(screen.getByRole("progressbar", { name: "럭키드로우 진행률" })).toHaveAttribute(
    "aria-valuetext",
    "20개 중 5개",
  );
});

it("목표 개수를 채우면 응모 완료를 보여준다", () => {
  render(<LuckyDrawCard collectedCount={20} goalCount={20} />);

  expect(screen.getByText("응모 완료!")).toBeInTheDocument();
  expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
});
