"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

import { projectQueries } from "../api/project.queries";
import type { Zone } from "../types";
import { ProjectCard } from "./ProjectCard";

const SKELETON_CARD_COUNT = 4;

interface ProjectListProps {
  zone: Zone;
}

export function ProjectList({ zone }: ProjectListProps) {
  const { data: projectsByZone } = useSuspenseQuery(projectQueries.list());
  // 프로젝트가 없는 구역은 응답에서 키가 빠질 수 있음
  const projects = projectsByZone[zone] ?? [];

  if (projects.length === 0) {
    return <p className="py-4 text-body-r-16 text-gray300">등록된 프로젝트가 없어요.</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-x-2.5 gap-y-5">
      {projects.map((project) => (
        <li key={project.id}>
          <Link
            href={`/projects/${project.id}`}
            className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ProjectCard
              thumbnailSrc={project.thumbnailUrl}
              name={project.title}
              summary={project.summary}
              platform={project.platform}
            />
          </Link>
        </li>
      ))}
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
