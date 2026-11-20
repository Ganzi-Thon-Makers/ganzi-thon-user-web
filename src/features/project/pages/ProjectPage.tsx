"use client";

import { Suspense } from "@suspensive/react";
import { useRef, useState } from "react";

import { AppBar } from "@/shared/components/AppBar";
import { PageShell } from "@/shared/components/PageShell";
import { Button } from "@/shared/ui/Button";
import { ChevronLeftIcon } from "@/shared/ui/icons";
import { TabIndicator, TabList, TabPanel, TabRoot, TabTrigger } from "@/shared/ui/Tab";

import { ProjectList, ProjectListSkeleton } from "../components/ProjectList";
import { VoteCompleteModal, VoteConfirmModal } from "../components/VoteModals";
import { useProjectVoteFlow } from "../hooks/use-project-vote-flow";
import { type Zone, ZONE_LABELS, ZONES } from "../types";

export function ProjectPage() {
  const voteFlow = useProjectVoteFlow();
  const actionButtonRef = useRef<HTMLButtonElement>(null);
  // 직접 고르기 전에는 투표한 프로젝트의 구역을 먼저 보여 줌(마이페이지 투표내역에서 진입)
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const zone = selectedZone ?? voteFlow.votedZone ?? ZONES[0];
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
    <TabRoot
      value={zone}
      onValueChange={(value) => setSelectedZone(ZONES.find((item) => item === value) ?? null)}
      className="flex min-h-0 flex-1 flex-col"
    >
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
              {/* 투표한 구역을 알기 전에는 숨겨, Zone1에서 투표한 구역으로 미끄러지는 모습을 없앰 */}
              {voteFlow.votedZone !== undefined && <TabIndicator />}
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
            {action.votedTitle ? (
              // 서비스명(최대 15자, 기능 명세서)이 명세보다 길 때만 이름을 말줄임하고 뒤 문구는 항상 보이게 함
              <span className="flex min-w-0">
                <span className="min-w-0 truncate">{action.votedTitle}</span>
                <span className="shrink-0">{action.label}</span>
              </span>
            ) : (
              action.label
            )}
          </Button>
        }
      >
        {ZONES.map((zone) => (
          <TabPanel key={zone} value={zone} className="pt-5.5">
            <h2 className="sr-only">{ZONE_LABELS[zone]} 프로젝트</h2>
            <Suspense fallback={<ProjectListSkeleton />}>
              <ProjectList zone={zone} votedProjectId={voteFlow.votedProjectId} vote={vote} />
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
      <VoteCompleteModal
        open={voteFlow.isCompleteOpen}
        onOpenChange={voteFlow.setIsCompleteOpen}
        // 닫히면 "투표 완료" 문구가 있는 하단 버튼으로 포커스를 돌려 결과를 다시 들을 수 있게 함
        finalFocus={actionButtonRef}
      />
    </TabRoot>
  );
}
