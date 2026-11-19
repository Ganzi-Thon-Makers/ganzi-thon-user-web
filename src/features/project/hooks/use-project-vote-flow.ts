"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { toApiError } from "@/shared/api/error";
import { useToast } from "@/shared/ui/Toast";

import { projectMutations, projectQueries } from "../api/project.queries";
import { ZONES } from "../types";
import type { Project, ProjectsByZone, VotePeriod, Zone } from "../types";

const OPENS_AT_FORMAT = new Intl.DateTimeFormat("ko-KR", {
  hour: "numeric",
  minute: "numeric",
  timeZone: "Asia/Seoul",
});
const DEFAULT_ERROR_MESSAGE = "투표하지 못했어요. 잠시 후 다시 시도해 주세요.";
// 서버 문구를 그대로 보여 줄 투표 규칙 에러 (결정 001 opt-in, API 계약 문서의 투표 에러 code)
const SERVER_MESSAGE_ERROR_CODES = [
  "VOTE_OWN_PROJECT",
  "VOTE_PARTICIPANT_ONLY",
  "VOTE_NOT_IN_PROGRESS",
  "VOTE_ALREADY_CAST",
] as const;

function isServerMessageErrorCode(code: string) {
  return SERVER_MESSAGE_ERROR_CODES.some((errorCode) => errorCode === code);
}

const OWN_PROJECT_MESSAGE = "본인이 참여한 프로젝트에는 투표할 수 없어요.";

interface VoteAction {
  label: string;
  isDisabled: boolean;
  /** 투표한 서비스명. 화면에는 이것만 보이고 label은 스크린리더용으로 뒤에 붙임 */
  votedTitle?: string;
}

interface VotedProject {
  project: Project;
  zone: Zone;
}

function formatOpensAt(opensAt: string) {
  // 서버 시각은 offset 없는 KST. "오후 2:00" → "오후 2시", 정각이 아니면 분까지 표시
  const [period, time] = OPENS_AT_FORMAT.format(new Date(`${opensAt}+09:00`)).split(" ");
  const [hour, minute] = time.split(":");
  return minute === "00" ? `${period} ${hour}시` : `${period} ${hour}시 ${minute}분`;
}

// 사용자당 1표라 isVoted인 프로젝트가 내가 투표한 팀. 없으면 null
function findVotedProject(projectsByZone: ProjectsByZone): VotedProject | null {
  for (const zone of ZONES) {
    const project = projectsByZone[zone]?.find((item) => item.isVoted);
    if (project) return { project, zone };
  }
  return null;
}

function getVoteAction(
  period: VotePeriod | undefined,
  votedProject: VotedProject | null | undefined,
  isError: boolean,
  isVoting: boolean,
  hasSelection: boolean,
): VoteAction {
  if (!period || votedProject === undefined) {
    return { label: isError ? "투표 정보를 불러오지 못했어요." : "인기투표", isDisabled: true };
  }
  // 투표한 뒤에는 마감·일시중지여도 어느 팀에 투표했는지 보여 줌
  if (votedProject) {
    return { label: "팀에게 투표 완료되었어요", isDisabled: true, votedTitle: votedProject.project.title };
  }
  if (period.status === "NOT_STARTED") {
    // 일정이 아직 등록되지 않으면 시작 시각이 없음
    if (!period.startTime) return { label: "인기투표", isDisabled: true };
    return { label: `${formatOpensAt(period.startTime)}부터 투표할 수 있어요.`, isDisabled: true };
  }
  // 일시중지는 관리자의 수동 닫기라 마감과 같게 보여 줌 (VOTE-01, ADMIN-05-1)
  if (period.status === "PAUSED" || period.status === "ENDED") return { label: "투표가 마감됐어요.", isDisabled: true };
  if (!isVoting) return { label: "인기투표", isDisabled: false };
  return { label: "투표하기", isDisabled: !hasSelection };
}

// 인기투표: 투표 모드 진입 → 카드 선택 → 확인 모달 → 투표 → 완료 모달 (VOTE-01)
export function useProjectVoteFlow() {
  // 투표 정보는 하단 버튼에만 필요해서, 목록 조회를 막지 않도록 suspend하지 않음
  const { data: period, isError } = useQuery(projectQueries.votePeriod());
  const { data: votedProject } = useQuery({ ...projectQueries.list(), select: findVotedProject });
  const { data: myProjectId } = useQuery({ ...projectQueries.mine(), select: (project) => project?.id ?? null });
  const vote = useMutation(projectMutations.vote());
  const toast = useToast();

  const [isVotingMode, setIsVotingMode] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  // 조회 중 마감·일시중지되거나 이미 투표한 것으로 확인되면 모드·선택·확인 모달을 함께 초기화
  // 재개돼도 이전 선택·모달이 저절로 다시 나타나지 않게 함. 투표 요청 중에는 확인 모달이 완료 모달로 이어지도록 두지 않음
  const canVote = period?.status === "IN_PROGRESS" && votedProject === null;
  if (!canVote && !vote.isPending && (isVotingMode || selectedProjectId !== null || isConfirmOpen)) {
    setIsVotingMode(false);
    setSelectedProjectId(null);
    setIsConfirmOpen(false);
  }
  const isVoting = isVotingMode && canVote;

  // 하단 버튼: 투표 모드 진입 → (선택 후) 확인 모달
  function handleAction() {
    if (!isVoting) {
      setIsVotingMode(true);
      return;
    }
    // 내 프로젝트 조회가 끝나기 전에 고른 선택은 여기서 다시 확인
    if (selectedProjectId === myProjectId) {
      setSelectedProjectId(null);
      toast.error(OWN_PROJECT_MESSAGE);
      return;
    }
    setIsConfirmOpen(true);
  }

  function cancelVoting() {
    setIsVotingMode(false);
    setSelectedProjectId(null);
  }

  function selectProject(projectId: number) {
    if (projectId === myProjectId) {
      toast.error(OWN_PROJECT_MESSAGE);
      return;
    }
    setSelectedProjectId(projectId);
  }

  function submitVote() {
    if (!isVoting || selectedProjectId === null) return;
    vote.mutate(selectedProjectId, {
      onSuccess: () => {
        setIsConfirmOpen(false);
        setIsVotingMode(false);
        setSelectedProjectId(null);
        setIsCompleteOpen(true);
      },
      onError: (error) => {
        setIsConfirmOpen(false);
        // TODO: 투표 규칙 에러 외 실패 문구는 디자인에 없어 임시 문구
        const { code, message } = toApiError(error);
        toast.error(isServerMessageErrorCode(code) ? message : DEFAULT_ERROR_MESSAGE);
      },
    });
  }

  return {
    action: getVoteAction(period, votedProject, isError, isVoting, selectedProjectId !== null),
    votedProjectId: votedProject?.project.id ?? null,
    // 목록을 받기 전에는 undefined, 투표하지 않았으면 null
    votedZone: votedProject === undefined ? undefined : (votedProject?.zone ?? null),
    isVoting,
    selectedProjectId,
    isConfirmOpen,
    isCompleteOpen,
    isSubmitting: vote.isPending,
    handleAction,
    cancelVoting,
    selectProject,
    setIsConfirmOpen,
    setIsCompleteOpen,
    submitVote,
  };
}
