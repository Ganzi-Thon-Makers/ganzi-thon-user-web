import type { VoteStatus } from "../types";

// TODO: 서버 투표 API가 나오면 실제 응답으로 교체한다.
// 서버가 토큰으로 사용자·소속 팀을 구분하는 부분을 목에서는 이 값으로 대신한다.
// 목록은 실제 API라 특정 id를 본인 팀으로 두면 실제 프로젝트가 막혀서 null로 둠
export const mockVoteStatus: VoteStatus = {
  phase: "OPEN",
  opensAt: "2026-11-21T14:00:00",
  votedProjectId: null,
  myProjectId: null,
};
