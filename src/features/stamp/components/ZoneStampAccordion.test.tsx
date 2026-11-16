import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";

import { ZoneStampAccordion } from "./ZoneStampAccordion";

const stamps = [
  { boothName: "A-1", isCollected: true, boothId: 1 },
  { boothName: "A-2", isCollected: false, boothId: 2 },
  { boothName: "A-3", isCollected: false, boothId: 3 },
  { boothName: "A-4", isCollected: false, boothId: 4 },
];

it("모은 개수와 수료까지 남은 개수를 보여주고, 펼치면 부스별 스탬프를 보여준다", async () => {
  const user = userEvent.setup();
  render(<ZoneStampAccordion zoneName="A구역" requiredCount={3} stamps={stamps} />);

  expect(screen.getByText("A구역 수료까지 2개")).toBeInTheDocument();
  expect(screen.getByText("4개 중 1개")).toBeInTheDocument();
  expect(screen.getByText("A-1")).not.toBeVisible();

  await user.click(screen.getByText("A구역 수료까지 2개"));

  expect(screen.getByText("A-1")).toBeVisible();
  expect(screen.getAllByText("미획득")).toHaveLength(3);
});

it("수료 기준을 채우면 수료 완료를 보여준다", () => {
  const collectedStamps = stamps.map((stamp, index) => ({ ...stamp, isCollected: index < 3 }));
  render(<ZoneStampAccordion zoneName="A구역" requiredCount={3} stamps={collectedStamps} />);

  expect(screen.getByText("A구역 수료 완료")).toBeInTheDocument();
});

it("미수집 부스는 배치도 위치로 가는 링크로 보여주고, 수집한 부스는 링크가 아니다", async () => {
  const user = userEvent.setup();
  render(<ZoneStampAccordion zoneName="A구역" requiredCount={3} stamps={stamps} />);

  await user.click(screen.getByText("A구역 수료까지 2개"));

  expect(screen.getByRole("link", { name: "A-2 미획득, 부스 위치 보기" })).toHaveAttribute("href", "/booths?boothId=2");
  expect(screen.queryByRole("link", { name: /A-1/ })).not.toBeInTheDocument();
});
