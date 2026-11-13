import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";

import { TabPanel, TabRoot } from "@/shared/ui/Tab";

import { ClassroomTabList } from "./ClassroomTabList";

it("강의실 탭을 누르면 해당 강의실 패널로 바뀐다", async () => {
  const user = userEvent.setup();
  render(
    <TabRoot defaultValue="A">
      <ClassroomTabList />
      <TabPanel value="A">A 배치도</TabPanel>
      <TabPanel value="B">B 배치도</TabPanel>
    </TabRoot>,
  );

  expect(screen.getByRole("tab", { name: "강의실 A", selected: true })).toBeInTheDocument();
  await user.click(screen.getByRole("tab", { name: "강의실 B" }));

  expect(screen.getByRole("tab", { name: "강의실 B", selected: true })).toBeInTheDocument();
  expect(screen.getByRole("tabpanel")).toHaveTextContent("B 배치도");
});
