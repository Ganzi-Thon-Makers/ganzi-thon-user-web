"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { useToast } from "@/shared/ui/Toast";

import { projectMutations, projectQueries } from "../api/project.queries";
import type { VoteStatus } from "../types";

const OPENS_AT_FORMAT = new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "numeric" });

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

function getVoteAction(
  status: VoteStatus | undefined,
  isError: boolean,
  isVoting: boolean,
  hasSelection: boolean,
): VoteAction {
  if (!status) return { label: isError ? "투표 정보를 불러오지 못했어요." : "인기투표", isDisabled: true };
  if (status.phase === "BEFORE") {
    return { label: `${formatOpensAt(status.opensAt)}부터 투표할 수 있어요.`, isDisabled: true };
  }
  if (status.phase === "CLOSED") return { label: "투표가 마감됐어요.", isDisabled: true };
  if (status.votedProjectId !== null) return { label: "투표가 완료되었어요", isDisabled: true };
  if (!isVoting) return { label: "인기투표", isDisabled: false };
  return { label: "투표하기", isDisabled: !hasSelection };
}

// 인기투표: 투표 모드 진입 → 카드 선택 → 확인 모달 → 투표 → 완료 모달 (VOTE-01)
export function useProjectVoteFlow() {
  // 투표 상태는 하단 버튼에만 필요해서, 목록 조회를 막지 않도록 suspend하지 않음
  const { data: status, isError } = useQuery(projectQueries.voteStatus());
  const vote = useMutation(projectMutations.vote());
  const toast = useToast();

  const [isVotingMode, setIsVotingMode] = useState(false);
  // 조회 중 마감되거나 다른 기기에서 투표하면 투표 모드를 함께 끔
  const canVote = status?.phase === "OPEN" && status.votedProjectId === null;
  const isVoting = isVotingMode && canVote;
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  // 하단 버튼: 투표 모드 진입 → (선택 후) 확인 모달
  function handleAction() {
    if (!isVoting) {
      setIsVotingMode(true);
      return;
    }
    setIsConfirmOpen(true);
  }

  function selectProject(projectId: number) {
    if (projectId === status?.myProjectId) {
      toast.error("본인이 참여한 프로젝트에는 투표할 수 없어요.");
      return;
    }
    setSelectedProjectId(projectId);
  }

  function submitVote() {
    if (selectedProjectId === null) return;
    vote.mutate(selectedProjectId, {
      onSuccess: () => {
        setIsConfirmOpen(false);
        setIsVotingMode(false);
        setSelectedProjectId(null);
        setIsCompleteOpen(true);
      },
      onError: () => {
        setIsConfirmOpen(false);
        // TODO: 실패 문구가 디자인에 없어 임시 문구. 서버 에러 코드가 정해지면 원인별로 나눔
        toast.error("투표하지 못했어요. 잠시 후 다시 시도해 주세요.");
      },
    });
  }

  return {
    action: getVoteAction(status, isError, isVoting, selectedProjectId !== null),
    isVoting,
    selectedProjectId,
    isConfirmOpen,
    isCompleteOpen,
    isSubmitting: vote.isPending,
    handleAction,
    selectProject,
    setIsConfirmOpen,
    setIsCompleteOpen,
    submitVote,
  };
}
