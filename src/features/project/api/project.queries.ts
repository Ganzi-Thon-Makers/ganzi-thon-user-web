import { mutationOptions, queryOptions } from "@tanstack/react-query";

import type { Zone } from "../types";
import { createVote, getProject, getProjects, getVoteStatus } from "./project.api";

export const projectQueries = {
  all: () => ["projects"] as const,
  list: (zone: Zone) =>
    queryOptions({ queryKey: [...projectQueries.all(), "list", zone], queryFn: () => getProjects(zone) }),
  detail: (id: number) =>
    queryOptions({ queryKey: [...projectQueries.all(), "detail", id], queryFn: () => getProject(id) }),
  voteStatus: () => queryOptions({ queryKey: [...projectQueries.all(), "vote-status"], queryFn: getVoteStatus }),
};

export const projectMutations = {
  vote: () =>
    mutationOptions({
      mutationFn: createVote,
      // 응답이 새 투표 상태라 다시 조회하지 않고 바로 반영
      onSuccess: (status, _projectId, _result, { client }) =>
        client.setQueryData(projectQueries.voteStatus().queryKey, status),
      // 실패는 기간 종료·중복 투표처럼 캐시와 서버 상태가 어긋난 경우일 수 있어 다시 조회
      onError: (_error, _projectId, _result, { client }) =>
        client.invalidateQueries({ queryKey: projectQueries.voteStatus().queryKey }),
    }),
};
