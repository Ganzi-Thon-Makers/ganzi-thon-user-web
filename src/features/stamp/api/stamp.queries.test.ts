import { MutationObserver, QueryClient, QueryObserver } from "@tanstack/react-query";
import { expect, it, vi } from "vitest";

import { makeStampBoard, makeZoneStatus } from "../stamp.fixtures";
import { collectStamp, getStampBoard } from "./stamp.api";
import { stampMutations, stampQueries } from "./stamp.queries";

vi.mock("./stamp.api");

it("스탬프판 재조회가 실패해도 적립 성공 결과가 유지된다", async () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  const options = stampQueries.board();
  const zone = makeZoneStatus("ZONE1", [1, 2, 3], [1]);
  client.setQueryData(options.queryKey, makeStampBoard({ collectedCount: 14, zoneStatuses: [zone] }));
  vi.mocked(collectStamp).mockResolvedValue({
    status: "collected",
    boothId: 2,
    collectedCount: 15,
    luckyDrawEntered: true,
  });
  vi.mocked(getStampBoard).mockRejectedValue(new Error("조회 실패"));
  const query = new QueryObserver(client, options);
  const unsubscribe = query.subscribe(() => {});

  try {
    await new MutationObserver(client, stampMutations.collect()).mutate("token");

    await vi.waitFor(() => expect(query.getCurrentResult().isRefetchError).toBe(true));
    expect(query.getCurrentResult().data).toMatchObject({
      collectedCount: 15,
      luckyDrawEntered: true,
      zoneStatuses: [{ collectedCount: 2, booths: [{ collected: true }, { collected: true }, { collected: false }] }],
    });
  } finally {
    unsubscribe();
    client.clear();
  }
});

it("중복 응답을 다시 적용해도 이미 적립된 칸과 개수가 그대로다", async () => {
  const client = new QueryClient();
  const { queryKey } = stampQueries.board();
  const zone = makeZoneStatus("ZONE2", [1, 2], [1]);
  client.setQueryData(queryKey, makeStampBoard({ collectedCount: 2, zoneStatuses: [zone] }));
  vi.mocked(collectStamp).mockResolvedValue({
    status: "already-collected",
    boothId: 2,
    collectedCount: 2,
    luckyDrawEntered: false,
  });
  const mutation = new MutationObserver(client, stampMutations.collect());

  try {
    await mutation.mutate("token");
    await mutation.mutate("token");

    expect(client.getQueryData(queryKey)).toMatchObject({
      collectedCount: 2,
      zoneStatuses: [{ collectedCount: 2, booths: [{ collected: true }, { collected: true }] }],
    });
  } finally {
    client.clear();
  }
});
