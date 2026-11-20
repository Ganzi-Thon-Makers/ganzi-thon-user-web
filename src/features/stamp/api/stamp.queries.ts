import { mutationOptions, queryOptions } from "@tanstack/react-query";

import { type StampBoard, ZONE_COMPLETION_COUNT } from "../types";
import {
  type CollectStampResult,
  collectStamp,
  getMyStampBooth,
  getOperatorBooth,
  getStampBoard,
  issueStampToken,
} from "./stamp.api";

export const stampQueries = {
  all: () => ["stamps"] as const,
  board: () => queryOptions({ queryKey: [...stampQueries.all(), "board"], queryFn: getStampBoard }),
  myBooth: () => queryOptions({ queryKey: [...stampQueries.all(), "my-booth"], queryFn: getMyStampBooth }),
  operatorBooth: () => queryOptions({ queryKey: [...stampQueries.all(), "operator-booth"], queryFn: getOperatorBooth }),
};

function applyCollectedStamp(board: StampBoard, result: Extract<CollectStampResult, { boothId: number }>): StampBoard {
  const zoneStatuses = board.zoneStatuses.map((zone) => {
    if (!zone.booths.some((booth) => booth.boothId === result.boothId && !booth.collected)) return zone;

    const booths = zone.booths.map((booth) =>
      booth.boothId === result.boothId ? { ...booth, collected: true } : booth,
    );
    const collectedCount = booths.filter((booth) => booth.collected).length;
    const completed = zone.completed || collectedCount >= ZONE_COMPLETION_COUNT;
    return { ...zone, booths, collectedCount, completed };
  });

  return {
    ...board,
    collectedCount: Math.max(board.collectedCount, result.collectedCount),
    luckyDrawEntered: board.luckyDrawEntered || result.luckyDrawEntered,
    zoneStatuses,
  };
}

export const stampMutations = {
  collect: () =>
    mutationOptions({
      mutationFn: collectStamp,
      onMutate: (_token, { client }) =>
        client.getQueryCache().find({ queryKey: stampQueries.board().queryKey, exact: true }),
      onSuccess: async (result, _token, boardQuery, { client }) => {
        if (result.status !== "collected" && result.status !== "already-collected") return;

        const { queryKey } = stampQueries.board();
        if (!boardQuery || !client.getQueryData(queryKey)) {
          await client.invalidateQueries({ queryKey });
          return;
        }

        if (boardQuery !== client.getQueryCache().find({ queryKey, exact: true })) return;

        await client.cancelQueries({ queryKey });
        if (boardQuery !== client.getQueryCache().find({ queryKey, exact: true })) return;

        client.setQueryData(queryKey, (board) => board && applyCollectedStamp(board, result));
        client.invalidateQueries({ queryKey });
      },
    }),
  // 발급한 토큰은 이 화면에서만 쓰여 캐시에 두지 않음
  issueToken: () => mutationOptions({ mutationFn: issueStampToken }),
};
