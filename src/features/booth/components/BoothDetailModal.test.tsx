import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";

import { mockBoothZones } from "../api/booth.mock";
import { BoothZoneMap } from "./BoothZoneMap";

it("누른 부스의 정보를 표시하고 Escape로 닫으면 포커스를 버튼으로 돌려준다", async () => {
  const user = userEvent.setup();
  render(<BoothZoneMap zones={mockBoothZones} />);
  const booth = screen.getByRole("button", { name: "서비스 2" });

  await user.click(booth);

  const modal = await screen.findByRole("dialog", { name: "서비스 2" });
  expect(within(modal).getByText("104호 팀 2")).toBeInTheDocument();
  expect(within(modal).getByText("APP")).toBeInTheDocument();
  expect(within(modal).getByRole("img", { name: "서비스 2 썸네일" })).toBeInTheDocument();
  expect(modal).toHaveAccessibleDescription("104호 부스에서 팀 2의 서비스를 체험해 볼 수 있어요.");

  await user.keyboard("{Escape}");

  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(booth).toHaveFocus();
  });
});

it("다른 호실의 부스를 선택하면 해당 부스 정보가 열리고 닫기 버튼으로 닫을 수 있다", async () => {
  const user = userEvent.setup();
  render(<BoothZoneMap zones={mockBoothZones} />);

  await user.click(screen.getByRole("tab", { name: "Zone3" }));
  await user.click(screen.getByRole("tab", { name: "204호" }));
  await user.click(screen.getByRole("button", { name: "서비스 1" }));

  const modal = await screen.findByRole("dialog", { name: "서비스 1" });
  expect(within(modal).getByText("204호 팀 1")).toBeInTheDocument();
  expect(within(modal).getByText("WEB")).toBeInTheDocument();
  await user.click(within(modal).getByRole("button", { name: "부스 상세 닫기" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
});
