import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";

import { TabPanel, TabRoot } from "@/shared/ui/Tab";

import { ClassroomTabList } from "./ClassroomTabList";

it("호실 탭을 누르면 해당 호실 패널로 바뀐다", async () => {
  const user = userEvent.setup();
  render(
    <TabRoot defaultValue="201">
      <ClassroomTabList roomNumbers={["201", "202"]} />
      <TabPanel value="201">201호 배치도</TabPanel>
      <TabPanel value="202">202호 배치도</TabPanel>
    </TabRoot>,
  );

  expect(screen.getByRole("tab", { name: "201호", selected: true })).toBeInTheDocument();
  await user.click(screen.getByRole("tab", { name: "202호" }));

  expect(screen.getByRole("tab", { name: "202호", selected: true })).toBeInTheDocument();
  expect(screen.getByRole("tabpanel")).toHaveTextContent("202호 배치도");
});
