import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";

import { BoothButton } from "./BoothButton";

it("서비스 이름으로 찾을 수 있고 누르면 onClick을 호출한다", async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn<() => void>();
  render(<BoothButton onClick={handleClick}>Framey</BoothButton>);

  await user.click(screen.getByRole("button", { name: "Framey" }));

  expect(handleClick).toHaveBeenCalledOnce();
});
