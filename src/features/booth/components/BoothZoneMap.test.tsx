import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";

import { mockBoothZones } from "../api/booth.mock";
import { BoothZoneMap } from "./BoothZoneMap";

it("Zone을 바꾸면 해당 Zone의 첫 호실을 표시한다", async () => {
  const user = userEvent.setup();
  render(<BoothZoneMap zones={mockBoothZones} />);

  expect(screen.getByRole("heading", { name: "104호" })).toBeInTheDocument();
  expect(screen.getAllByRole("button")).toHaveLength(8);

  await user.click(screen.getByRole("tab", { name: "Zone2" }));

  expect(screen.getByRole("tab", { name: "201호", selected: true })).toBeInTheDocument();
  expect(screen.getAllByRole("button")).toHaveLength(5);
});
