import { mutationOptions, queryOptions } from "@tanstack/react-query";

import { collectStamp, getMyStamps, getOperatorBooth, getStampZones, issueStampToken } from "./stamp.api";

export const stampQueries = {
  all: () => ["stamps"] as const,
  mine: () => queryOptions({ queryKey: [...stampQueries.all(), "mine"], queryFn: getMyStamps }),
  zones: () => queryOptions({ queryKey: [...stampQueries.all(), "zones"], queryFn: getStampZones }),
  operatorBooth: () => queryOptions({ queryKey: [...stampQueries.all(), "operator-booth"], queryFn: getOperatorBooth }),
};

export const stampMutations = {
  collect: () =>
    mutationOptions({
      mutationFn: collectStamp,
      // 적립 직후 스탬프판으로 이동하므로 새 목록을 받은 뒤에 끝나도록 기다림.
      // 이미 받은 부스도 다른 기기·탭에서 받은 것일 수 있어 함께 갱신
      onSuccess: (result, _token, _onMutateResult, { client }) => {
        if (result.status !== "collected" && result.status !== "already-collected") return;
        return client.invalidateQueries({ queryKey: stampQueries.mine().queryKey });
      },
    }),
  // 발급한 토큰은 이 화면에서만 쓰여 캐시에 두지 않음
  issueToken: () => mutationOptions({ mutationFn: issueStampToken }),
};
