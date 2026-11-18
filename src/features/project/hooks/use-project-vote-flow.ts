"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { toApiError } from "@/shared/api/error";
import { useToast } from "@/shared/ui/Toast";

import { projectMutations, projectQueries } from "../api/project.queries";
import type { ProjectsByZone, VotePeriod } from "../types";

const OPENS_AT_FORMAT = new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "numeric" });

const OWN_PROJECT_MESSAGE = "본인이 참여한 프로젝트에는 투표할 수 없어요.";

interface VoteAction {
  label: string;
  isDisabled: boolean;
}

function formatOpensAt(opensAt: string) {
  // "오후 2:00" → "오후 2시", 정각이 아니면 분까지 표시
  const [period, time] = OPENS_AT_FORMAT.format(new Date(opensAt)).split(" ");
  const [hour, minute] = time.split(":");
  return minute === "00" ? `${period} ${hour}시` : `${period} ${hour}시 ${minute}분`;
}

function hasVotedAny(projectsByZone: ProjectsByZone) {
  return Object.values(projectsByZone).some((projects) => projects?.some((project) => project.isVoted));
}

function getVoteAction(
  period: VotePeriod | undefined,
  hasVoted: boolean | undefined,
  isError: boolean,
  isVoting: boolean,
  hasSelection: boolean,
): VoteAction {
  if (!period || hasVoted === undefined) {
    return { label: isError ? "투표 정보를 불러오지 못했어요." : "인기투표", isDisabled: true };
  }
  if (period.status === "NOT_STARTED") {
    // 일정이 아직 등록되지 않으면 시작 시각이 없음
    if (!period.startTime) return { label: "인기투표", isDisabled: true };
    return { label: `${formatOpensAt(period.startTime)}부터 투표할 수 있어요.`, isDisabled: true };
  }
  // 일시중지는 관리자의 수동 닫기라 마감과 같게 보여 줌 (VOTE-01, ADMIN-05-1)
  if (period.status === "PAUSED" || period.status === "ENDED") return { label: "투표가 마감됐어요.", isDisabled: true };
  if (hasVoted) return { label: "투표가 완료되었어요", isDisabled: true };
  if (!isVoting) return { label: "인기투표", isDisabled: false };
  return { label: "투표하기", isDisabled: !hasSelection };
}

// 인기투표: 투표 모드 진입 → 카드 선택 → 확인 모달 → 투표 → 완료 모달 (VOTE-01)
export function useProjectVoteFlow() {
  // 투표 정보는 하단 버튼에만 필요해서, 목록 조회를 막지 않도록 suspend하지 않음
  const { data: period, isError } = useQuery(projectQueries.votePeriod());
  const { data: hasVoted } = useQuery({ ...projectQueries.list(), select: hasVotedAny });
  const { data: myProjectId } = useQuery({ ...projectQueries.mine(), select: (project) => project?.id ?? null });
  const vote = useMutation(projectMutations.vote());
  const toast = useToast();

  const [isVotingMode, setIsVotingMode] = useState(false);
  // 조회 중 마감·일시중지되거나 투표 실패 후 이미 투표한 것으로 확인되면 투표 모드를 함께 끔
  const canVote = period?.status === "IN_PROGRESS" && hasVoted === false;
  const isVoting = isVotingMode && canVote;
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [isConfirmOpenState, setIsConfirmOpen] = useState(false);
  // 모달이 열린 채 마감되면 함께 닫음
  const isConfirmOpen = isConfirmOpenState && isVoting;
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  // 하단 버튼: 투표 모드 진입 → (선택 후) 확인 모달
  function handleAction() {
    if (!isVoting) {
      setIsVotingMode(true);
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
        // 기간 종료·중복 투표는 다시 받은 상태로 버튼이 바뀌어, 본인 팀만 따로 안내
        // TODO: 실패 문구가 디자인에 없어 임시 문구
        toast.error(
          toApiError(error).code === "VOTE_OWN_PROJECT"
            ? OWN_PROJECT_MESSAGE
            : "투표하지 못했어요. 잠시 후 다시 시도해 주세요.",
        );
      },
    });
  }

  return {
    action: getVoteAction(period, hasVoted, isError, isVoting, selectedProjectId !== null),
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
