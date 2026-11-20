import { mutationOptions, queryOptions } from "@tanstack/react-query";

import type { ProjectsByZone } from "../types";
import { createVote, getMyProject, getProject, getProjects, getVotePeriod } from "./project.api";

function markVoted(projectsByZone: ProjectsByZone, projectId: number): ProjectsByZone {
  return Object.fromEntries(
    Object.entries(projectsByZone).map(([zone, projects]) => [
      zone,
      projects?.map((project) => (project.id === projectId ? { ...project, isVoted: true } : project)),
    ]),
  );
}

export const projectQueries = {
  all: () => ["projects"] as const,
  list: () => queryOptions({ queryKey: [...projectQueries.all(), "list"], queryFn: getProjects }),
  detail: (id: number) =>
    queryOptions({ queryKey: [...projectQueries.all(), "detail", id], queryFn: () => getProject(id) }),
  mine: () =>
    queryOptions({
      queryKey: [...projectQueries.all(), "mine"],
      queryFn: getMyProject,
      select: (project) => project.id,
    }),
  votePeriod: () =>
    queryOptions({
      queryKey: [...projectQueries.all(), "vote-period"],
      queryFn: getVotePeriod,
      // 관리자가 투표를 일시중지하거나 재개하는 경우 반영
      refetchInterval: 30_000,
    }),
};

export const projectMutations = {
  vote: () =>
    mutationOptions({
      mutationFn: createVote,
      // 다시 조회가 실패해도 투표 완료가 유지되도록 고른 프로젝트를 먼저 투표함으로 표시
      onSuccess: (_data, projectId, _result, { client }) =>
        client.setQueryData(projectQueries.list().queryKey, (projectsByZone) =>
          projectsByZone ? markVoted(projectsByZone, projectId) : projectsByZone,
        ),
      // 성공하면 목록의 isVoted가, 실패하면 기간 종료·중복 투표처럼 어긋난 상태가 바뀌어 투표 관련 조회를 다시 받음
      onSettled: (_data, _error, _projectId, _result, { client }) =>
        Promise.all([
          client.invalidateQueries({ queryKey: projectQueries.list().queryKey }),
          client.invalidateQueries({ queryKey: projectQueries.votePeriod().queryKey }),
        ]),
    }),
};
