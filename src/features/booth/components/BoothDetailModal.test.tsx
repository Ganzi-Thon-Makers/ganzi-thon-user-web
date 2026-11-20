import { act, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";

import { localApi } from "@/shared/api/client";
import { renderWithProviders } from "@/shared/test/render";

import { getBoothDetail } from "../api/booth.api";
import type { BoothDetail, BoothZone } from "../types";
import { BoothZoneMap } from "./BoothZoneMap";

vi.mock(import("../api/booth.api"), async (importOriginal) => ({
  ...(await importOriginal()),
  getBoothDetail: vi.fn<typeof getBoothDetail>(),
}));

const mockGetBoothDetail = vi.mocked(getBoothDetail);
const firstBooth = {
  title: "첫 프로젝트",
  teamName: "첫 팀",
  platform: "APP",
  summary: "첫 프로젝트 설명",
  thumbnailUrl: "/thumbnail.webp",
} satisfies BoothDetail;
const secondBooth = { ...firstBooth, title: "두 번째 프로젝트", teamName: "두 번째 팀" };

const zones: BoothZone[] = [
  {
    code: "ZONE1",
    rooms: [
      {
        number: "104",
        booths: [
          { roomNumber: "104", boothId: 101, boothNumber: 1, teamNumber: 7 },
          { roomNumber: "104", boothId: 202, boothNumber: 2, teamNumber: 12 },
        ],
      },
      { number: "105", booths: [{ roomNumber: "105", boothId: 303, boothNumber: 1, teamNumber: 5 }] },
    ],
  },
];

beforeEach(() => {
  mockGetBoothDetail.mockReset();
});

function renderBoothMap() {
  return renderWithProviders(<BoothZoneMap zones={zones} />);
}

function rejectDetail(status: number, code: string, message: string) {
  const client = localApi.extend({
    fetch: async () => Response.json({ status, code, message }, { status }),
  });
  return client.get("http://localhost:3000/api/v1/booth/101").json<BoothDetail>();
}

it("상세 카드를 열고 Escape로 닫으면 포커스가 부스 버튼으로 돌아온다", async () => {
  mockGetBoothDetail.mockResolvedValueOnce(firstBooth);
  const { user } = renderBoothMap();
  const trigger = screen.getByRole("button", { name: "7팀" });

  await user.click(trigger);

  const modal = await screen.findByRole("dialog", { name: firstBooth.title });
  expect(within(modal).getByText(firstBooth.teamName)).toBeInTheDocument();
  expect(within(modal).getByText(firstBooth.platform)).toBeInTheDocument();
  expect(within(modal).getByRole("img", { name: `${firstBooth.title} 썸네일` })).toBeInTheDocument();
  expect(modal).toHaveAccessibleDescription(firstBooth.summary);

  await user.keyboard("{Escape}");

  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

it("모달을 열 때 선택한 ID만 조회하고 로딩 후 상세 카드를 표시한다", async () => {
  const pending = Promise.withResolvers<BoothDetail>();
  mockGetBoothDetail.mockReturnValueOnce(pending.promise);
  const { user } = renderBoothMap();

  expect(mockGetBoothDetail).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: "12팀" }));

  expect(screen.getByRole("dialog", { name: "부스 상세" })).toHaveAccessibleDescription(
    "부스 정보를 불러오는 중이에요.",
  );
  expect(mockGetBoothDetail).toHaveBeenCalledExactlyOnceWith(202);

  pending.resolve(secondBooth);
  const modal = await screen.findByRole("dialog", { name: secondBooth.title });
  expect(within(modal).getByText(secondBooth.teamName)).toBeInTheDocument();
  expect(modal).toHaveAccessibleDescription(secondBooth.summary);
});

it.each([
  ["PROJECT_NOT_FOUND", "프로젝트를 찾을 수 없습니다."],
  ["BOOTH_NOT_FOUND", "부스를 찾을 수 없습니다."],
])("404 %s를 모달에서 구분하고 다시 시도를 표시하지 않는다", async (code, message) => {
  mockGetBoothDetail.mockImplementationOnce(() => rejectDetail(404, code, message));
  const { user } = renderBoothMap();
  const trigger = screen.getByRole("button", { name: "7팀" });

  await user.click(trigger);

  const modal = await screen.findByRole("dialog", { description: message });
  expect(within(modal).queryByRole("button", { name: "다시 시도" })).not.toBeInTheDocument();

  await user.click(within(modal).getByRole("button", { name: "부스 상세 닫기" }));
  await waitFor(() => expect(trigger).toHaveFocus());
});

it("일시적인 실패 후 모달에서 같은 부스의 조회를 다시 시도할 수 있다", async () => {
  const message = "서비스를 일시적으로 사용할 수 없습니다.";
  mockGetBoothDetail.mockImplementationOnce(() => rejectDetail(503, "SERVICE_UNAVAILABLE", message));
  mockGetBoothDetail.mockResolvedValueOnce(firstBooth);
  const { user } = renderBoothMap();

  await user.click(screen.getByRole("button", { name: "7팀" }));
  const modal = await screen.findByRole("dialog", { description: message });
  await user.click(within(modal).getByRole("button", { name: "다시 시도" }));

  expect(await screen.findByRole("dialog", { name: firstBooth.title })).toBeInTheDocument();
  expect(mockGetBoothDetail.mock.calls.map(([boothId]) => boothId)).toEqual([101, 101]);
});

it("같은 화면에서 부스를 바꾸면 이전 부스의 캐시 데이터를 보여주지 않는다", async () => {
  mockGetBoothDetail.mockResolvedValueOnce(firstBooth).mockResolvedValueOnce(secondBooth);
  const { user } = renderBoothMap();
  const firstTrigger = screen.getByRole("button", { name: "7팀" });
  const secondTrigger = screen.getByRole("button", { name: "12팀" });

  await user.click(firstTrigger);
  expect(await screen.findByRole("dialog", { name: firstBooth.title })).toBeInTheDocument();
  await user.keyboard("{Escape}");
  await waitFor(() => expect(firstTrigger).toHaveFocus());

  await user.click(secondTrigger);
  expect(await screen.findByRole("dialog", { name: secondBooth.title })).toBeInTheDocument();
  expect(screen.queryByText(firstBooth.teamName)).not.toBeInTheDocument();
  await user.keyboard("{Escape}");
  await waitFor(() => expect(secondTrigger).toHaveFocus());

  await user.click(firstTrigger);
  expect(await screen.findByRole("dialog", { name: firstBooth.title })).toBeInTheDocument();
  expect(mockGetBoothDetail.mock.calls.map(([boothId]) => boothId)).toEqual([101, 202]);
});

it("로딩 중 닫아도 이전 응답이 다음 모달에 표시되지 않는다", async () => {
  const pending = Promise.withResolvers<BoothDetail>();
  mockGetBoothDetail.mockReturnValueOnce(pending.promise).mockResolvedValueOnce(secondBooth);
  const { user } = renderBoothMap();
  const firstTrigger = screen.getByRole("button", { name: "7팀" });
  const secondTrigger = screen.getByRole("button", { name: "12팀" });

  await user.click(firstTrigger);
  await screen.findByRole("dialog", { description: "부스 정보를 불러오는 중이에요." });
  await user.keyboard("{Escape}");
  await waitFor(() => expect(firstTrigger).toHaveFocus());

  await user.click(secondTrigger);
  const modal = await screen.findByRole("dialog", { name: secondBooth.title });
  await act(async () => pending.resolve(firstBooth));
  expect(modal).toHaveAccessibleName(secondBooth.title);
  expect(screen.queryByText(firstBooth.teamName)).not.toBeInTheDocument();
});

it("다른 호실의 부스도 상세를 조회하고 닫기 버튼으로 닫을 수 있다", async () => {
  mockGetBoothDetail.mockResolvedValueOnce(firstBooth);
  const { user } = renderBoothMap();

  await user.click(screen.getByRole("tab", { name: "105호" }));
  const trigger = screen.getByRole("button", { name: "5팀" });
  await user.click(trigger);

  const modal = await screen.findByRole("dialog", { name: firstBooth.title });
  expect(mockGetBoothDetail).toHaveBeenCalledExactlyOnceWith(303);
  await user.click(within(modal).getByRole("button", { name: "부스 상세 닫기" }));
  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

it("처음 열 부스가 주어지면 그 부스의 호실을 보여 주고 상세를 연다", async () => {
  mockGetBoothDetail.mockResolvedValueOnce(secondBooth);
  renderWithProviders(<BoothZoneMap zones={zones} initialBoothId={303} />);

  expect(await screen.findByRole("dialog", { name: "두 번째 프로젝트" })).toBeInTheDocument();
  expect(mockGetBoothDetail).toHaveBeenCalledWith(303);
  // 모달이 열려 배치도는 보조기술에서 숨겨짐
  expect(screen.getByRole("tab", { name: "105호", selected: true, hidden: true })).toBeInTheDocument();
});

it("처음 열 부스가 배치도에 없으면 상세를 열지 않는다", () => {
  renderWithProviders(<BoothZoneMap zones={zones} initialBoothId={999} />);

  expect(screen.getByRole("tab", { name: "104호", selected: true })).toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(mockGetBoothDetail).not.toHaveBeenCalled();
});
