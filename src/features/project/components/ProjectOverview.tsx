import Image from "next/image";

import { Badge } from "@/shared/ui/Badge";
import { UpIcon } from "@/shared/ui/icons";

import type { ProjectDetail } from "../types";

interface ProjectOverviewProps {
  project: Pick<
    ProjectDetail,
    "title" | "teamName" | "summary" | "description" | "platform" | "thumbnailUrl" | "serviceUrl"
  >;
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <section aria-labelledby="project-title">
      <div className="relative h-50.5">
        <Image
          src={project.thumbnailUrl}
          alt={`${project.title} 썸네일`}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          loading="eager"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col items-start gap-4.5 px-[max(--spacing(5),env(safe-area-inset-left,0px),env(safe-area-inset-right,0px))] py-4">
        <div className="flex w-full flex-col gap-0.5">
          <div className="flex items-center justify-between gap-3">
            <h2 id="project-title" className="min-w-0 text-title-sb-20 wrap-break-word text-gray50">
              {project.title}
            </h2>
            <Badge>{project.platform}</Badge>
          </div>
          <p className="text-body-m-16 wrap-break-word text-gray300">{project.teamName}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-body-m-16 wrap-break-word text-gray50">{project.summary}</p>
          <p className="text-body-r-14 wrap-break-word text-gray300">{project.description}</p>
        </div>
        {project.serviceUrl && (
          <a
            href={project.serviceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-gray300 py-1 pr-2 pl-3 text-body-sb-14 text-gray900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            서비스 바로가기
            <span className="sr-only">(새 탭에서 열림)</span>
            <UpIcon aria-hidden className="size-5" />
          </a>
        )}
      </div>
    </section>
  );
}
