import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";

import { TabList, TabPanel, TabRoot, TabTrigger } from "./Tab";

it("선택한 탭에 대응하는 패널을 보여준다", async () => {
  const user = userEvent.setup();
  render(
    <TabRoot defaultValue="all">
      <TabList>
        <TabTrigger value="all">전체</TabTrigger>
        <TabTrigger value="zone1">Zone1</TabTrigger>
      </TabList>
      <TabPanel value="all">전체 부스</TabPanel>
      <TabPanel value="zone1">Zone1 부스</TabPanel>
    </TabRoot>,
  );

  expect(screen.getByRole("tabpanel")).toHaveTextContent("전체 부스");
  await user.click(screen.getByRole("tab", { name: "Zone1" }));

  expect(screen.getByRole("tab", { name: "Zone1", selected: true })).toBeVisible();
  expect(screen.getByRole("tabpanel")).toHaveTextContent("Zone1 부스");
});

it("탭 목록과 탭의 상태별 클래스를 기본 스타일과 함께 적용한다", async () => {
  const user = userEvent.setup();
  render(
    <TabRoot defaultValue="all">
      <TabList className={({ orientation }) => (orientation === "horizontal" ? "gap-2" : undefined)}>
        <TabTrigger value="all">전체</TabTrigger>
        <TabTrigger value="zone1" className={({ active }) => (active ? "text-red500" : undefined)}>
          Zone1
        </TabTrigger>
      </TabList>
    </TabRoot>,
  );

  const list = screen.getByRole("tablist");
  const tab = screen.getByRole("tab", { name: "Zone1" });
  expect(list).toHaveClass("flex", "gap-2");
  expect(tab).not.toHaveClass("text-red500");

  await user.click(tab);

  expect(tab).toHaveClass("h-12", "text-red500");
});
