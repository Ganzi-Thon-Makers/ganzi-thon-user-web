import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";

import { Tab } from "./Tab";

it("선택한 탭에 대응하는 패널을 보여준다", async () => {
  const user = userEvent.setup();
  render(
    <Tab.Root defaultValue="all">
      <Tab.List>
        <Tab.Trigger value="all">전체</Tab.Trigger>
        <Tab.Trigger value="zone1">Zone1</Tab.Trigger>
      </Tab.List>
      <Tab.Panel value="all">전체 부스</Tab.Panel>
      <Tab.Panel value="zone1">Zone1 부스</Tab.Panel>
    </Tab.Root>,
  );

  expect(screen.getByRole("tabpanel")).toHaveTextContent("전체 부스");
  await user.click(screen.getByRole("tab", { name: "Zone1" }));

  expect(screen.getByRole("tab", { name: "Zone1", selected: true })).toBeVisible();
  expect(screen.getByRole("tabpanel")).toHaveTextContent("Zone1 부스");
});
