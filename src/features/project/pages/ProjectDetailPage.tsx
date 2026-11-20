"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";

import { AppBar } from "@/shared/components/AppBar";
import { PageShell } from "@/shared/components/PageShell";
import { Button } from "@/shared/ui/Button";
import { ChevronLeftIcon } from "@/shared/ui/icons";

import { projectQueries } from "../api/project.queries";
import { ProjectOverview } from "../components/ProjectOverview";
import { ProjectTeamInfo } from "../components/ProjectTeamInfo";

// cacheComponents에서 서버 page가 params를 읽으면 prerender가 막혀, 경계 안쪽에서 읽음
export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project } = useSuspenseQuery(projectQueries.detail(Number(id)));

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
      <ProjectOverview project={project} />
      <ProjectTeamInfo members={project.members} techStack={project.techStack} />
    </PageShell>
  );
}
