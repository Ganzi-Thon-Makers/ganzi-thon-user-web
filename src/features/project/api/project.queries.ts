import { mutationOptions, queryOptions } from "@tanstack/react-query";

import type { Zone } from "../types";
import { createVote, getProject, getProjects, getVoteStatus } from "./project.api";

export const projectQueries = {
  all: () => ["projects"] as const,
  list: (zone: Zone) =>
    queryOptions({ queryKey: [...projectQueries.all(), "list", zone], queryFn: () => getProjects(zone) }),
  detail: (id: number) =>
    queryOptions({ queryKey: [...projectQueries.all(), "detail", id], queryFn: () => getProject(id) }),
  voteStatus: () =>
    queryOptions({
      queryKey: [...projectQueries.all(), "vote-status"],
      queryFn: getVoteStatus,
      // ponytail: 화면에 머무는 동안 개시·마감을 반영하려고 30초마다 다시 조회. 더 정확해야 하면 opensAt·마감 시각으로 계산
      refetchInterval: 30_000,
    }),
};

export const projectMutations = {
  vote: () =>
    mutationOptions({
      mutationFn: createVote,
      // 응답이 새 투표 상태라 다시 조회하지 않고 바로 반영
      // 진행 중인 주기 조회가 옛 상태로 덮지 않도록 먼저 취소
      onSuccess: async (status, _projectId, _result, { client }) => {
        await client.cancelQueries({ queryKey: projectQueries.voteStatus().queryKey });
        client.setQueryData(projectQueries.voteStatus().queryKey, status);
      },
      // 실패는 기간 종료·중복 투표처럼 캐시와 서버 상태가 어긋난 경우일 수 있어 다시 조회
      onError: (_error, _projectId, _result, { client }) =>
        client.invalidateQueries({ queryKey: projectQueries.voteStatus().queryKey }),
    }),
};
