"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

import { cn } from "@/shared/lib/cn";

import { projectQueries } from "../api/project.queries";
import type { Zone } from "../types";
import { ProjectCard } from "./ProjectCard";

const SKELETON_CARD_COUNT = 4;

const cardActionClassName =
  "block w-full rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

interface ProjectListProps {
  zone: Zone;
  /** 투표를 마쳤으면 투표한 프로젝트를 스크린리더에 알림 */
  votedProjectId?: number | null;
  /** 있으면 투표 모드: 카드가 상세 링크 대신 선택 버튼이 됨 */
  vote?: {
    selectedProjectId: number | null;
    onSelect: (projectId: number) => void;
  };
}

export function ProjectList({ zone, votedProjectId = null, vote }: ProjectListProps) {
  const { data: projectsByZone } = useSuspenseQuery(projectQueries.list());
  // 프로젝트가 없는 구역은 응답에서 키가 빠질 수 있음
  const projects = projectsByZone[zone] ?? [];

  if (projects.length === 0) {
    return <p className="py-4 text-body-r-16 text-gray300">등록된 프로젝트가 없어요.</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-x-2.5 gap-y-5">
      {projects.map((project) => {
        const isSelected = vote?.selectedProjectId === project.id;
        const isVoted = !vote && votedProjectId === project.id;
        const card = (
          <ProjectCard
            thumbnailSrc={project.thumbnailUrl}
            name={project.title}
            summary={project.summary}
            platform={project.platform}
            isSelected={isSelected}
            // 테두리·흐림은 고르는 중일 때만. 투표 후에는 평소 목록과 같게 둠 (Figma 737:5246)
            isDimmed={vote !== undefined && !isSelected}
          />
        );

        if (!vote) {
          return (
            <li key={project.id}>
              <Link href={`/projects/${project.id}`} className={cardActionClassName}>
                {card}
                {/* 화면에는 표시하지 않는 투표 여부를 스크린리더에 알림 */}
                {isVoted && <span className="sr-only">투표한 프로젝트</span>}
              </Link>
            </li>
          );
        }

        // button 안에는 article·heading을 둘 수 없어, 카드 위에 선택 버튼을 겹침
        return (
          <li key={project.id} className="relative">
            {card}
            <button
              type="button"
              aria-label={`${project.title} 선택`}
              aria-pressed={vote.selectedProjectId === project.id}
              onClick={() => vote.onSelect(project.id)}
              className={cn("absolute inset-0", cardActionClassName)}
            />
          </li>
        );
      })}
    </ul>
  );
}

export function ProjectListSkeleton() {
  return (
    <div aria-busy="true" aria-label="프로젝트 목록 불러오는 중" className="grid grid-cols-2 gap-x-2.5 gap-y-5">
      {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
        <div key={index} className="h-45 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}
