"use client";

import { Suspense } from "@suspensive/react";
import { useRef } from "react";

import { AppBar } from "@/shared/components/AppBar";
import { PageShell } from "@/shared/components/PageShell";
import { Button } from "@/shared/ui/Button";
import { ChevronLeftIcon } from "@/shared/ui/icons";
import { TabIndicator, TabList, TabPanel, TabRoot, TabTrigger } from "@/shared/ui/Tab";

import { ProjectList, ProjectListSkeleton } from "../components/ProjectList";
import { VoteCompleteModal, VoteConfirmModal } from "../components/VoteModals";
import { useProjectVoteFlow } from "../hooks/use-project-vote-flow";
import { ZONE_LABELS, ZONES } from "../types";

export function ProjectPage() {
  const voteFlow = useProjectVoteFlow();
  const actionButtonRef = useRef<HTMLButtonElement>(null);
  const { action } = voteFlow;
  const vote = voteFlow.isVoting
    ? { selectedProjectId: voteFlow.selectedProjectId, onSelect: voteFlow.selectProject }
    : undefined;

  // 누른 뒤로 가기 버튼이 사라져서, 다시 진입하는 하단 버튼으로 포커스를 옮김
  function handleCancelVoting() {
    voteFlow.cancelVoting();
    actionButtonRef.current?.focus();
  }

  return (
    // 탭 목록(header)과 패널(본문)이 같은 탭 상태를 써서 셸 바깥을 TabRoot로 감쌈
    <TabRoot defaultValue={ZONES[0]} className="flex min-h-0 flex-1 flex-col">
      <PageShell
        header={
          <div className="bg-gray800">
            {voteFlow.isVoting ? (
              <AppBar
                title={<span className="sr-only">인기투표</span>}
                leading={
                  <button
                    type="button"
                    aria-label="투표 그만하기"
                    onClick={handleCancelVoting}
                    className="grid size-full place-items-center focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                  >
                    <ChevronLeftIcon aria-hidden />
                  </button>
                }
                className="bg-gray800"
              />
            ) : (
              <AppBar title="프로젝트" withProfile className="bg-gray800" />
            )}
            <TabList>
              {ZONES.map((zone) => (
                <TabTrigger key={zone} value={zone}>
                  {ZONE_LABELS[zone]}
                </TabTrigger>
              ))}
              <TabIndicator />
            </TabList>
          </div>
        }
        footer={
          // 투표 모드 진입 직후 선택 전이라 비활성이 되어도 포커스를 잃지 않게 함
          <Button
            ref={actionButtonRef}
            className="w-full"
            disabled={action.isDisabled}
            focusableWhenDisabled
            onClick={voteFlow.handleAction}
          >
            {action.label}
          </Button>
        }
      >
        {ZONES.map((zone) => (
          <TabPanel key={zone} value={zone} className="pt-5.5">
            <h2 className="sr-only">{ZONE_LABELS[zone]} 프로젝트</h2>
            <Suspense fallback={<ProjectListSkeleton />}>
              <ProjectList zone={zone} vote={vote} />
            </Suspense>
          </TabPanel>
        ))}
      </PageShell>
      <VoteConfirmModal
        open={voteFlow.isConfirmOpen}
        onOpenChange={voteFlow.setIsConfirmOpen}
        isSubmitting={voteFlow.isSubmitting}
        onConfirm={voteFlow.submitVote}
      />
      <VoteCompleteModal open={voteFlow.isCompleteOpen} onOpenChange={voteFlow.setIsCompleteOpen} />
    </TabRoot>
  );
}
