"use client";

import { Suspense } from "@suspensive/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";

import { AppBar } from "@/shared/components/AppBar";
import { PageShell } from "@/shared/components/PageShell";
import { Button } from "@/shared/ui/Button";
import { ChevronLeftIcon } from "@/shared/ui/icons";

import { projectQueries } from "../api/project.queries";
import { ProjectOverview, ProjectOverviewSkeleton } from "../components/ProjectOverview";
import { ProjectTeamInfo, ProjectTeamInfoSkeleton } from "../components/ProjectTeamInfo";

interface ProjectDetailContentProps {
  id: number;
}

function ProjectDetailContent({ id }: ProjectDetailContentProps) {
  const { data: project } = useSuspenseQuery(projectQueries.detail(id));

  return (
    <>
      <ProjectOverview project={project} />
      <ProjectTeamInfo members={project.members} techStack={project.techStack} />
    </>
  );
}

function ProjectDetailSkeleton() {
  return (
    <output aria-busy="true" className="block">
      <span className="sr-only">프로젝트 상세 불러오는 중</span>
      <ProjectOverviewSkeleton />
      <ProjectTeamInfoSkeleton />
    </output>
  );
}

// cacheComponents에서 서버 page가 params를 읽으면 prerender가 막혀, 경계 안쪽에서 읽음
// 헤더·하단 버튼은 먼저 그리고 본문만 불러오는 동안 같은 골격의 스켈레톤으로 채움
export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <PageShell
      isFullBleed
      header={
        <AppBar
          title={<span className="sr-only">프로젝트 상세</span>}
          leading={
            <Link
              href="/projects"
              aria-label="프로젝트 목록으로 돌아가기"
              className="grid size-full place-items-center focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
            >
              <ChevronLeftIcon aria-hidden />
            </Link>
          }
        />
      }
      footerStyle="solid"
      footer={
        // 투표 흐름이 정해지기 전이라 동작 없이 비활성
        <Button disabled className="w-full">
          투표하기
        </Button>
      }
    >
      <Suspense fallback={<ProjectDetailSkeleton />}>
        <ProjectDetailContent id={Number(id)} />
      </Suspense>
    </PageShell>
  );
}
