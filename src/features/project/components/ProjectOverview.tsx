import Image from "next/image";

import { cn } from "@/shared/lib/cn";
import { Badge } from "@/shared/ui/Badge";
import { UpIcon } from "@/shared/ui/icons";

import type { ProjectDetail } from "../types";

interface ProjectOverviewProps {
  project: Pick<
    ProjectDetail,
    "title" | "teamName" | "summary" | "description" | "platform" | "thumbnailUrl" | "serviceUrl"
  >;
}

const THUMBNAIL_CLASS = "relative h-50.5";
const CONTENT_CLASS =
  "flex flex-col items-start gap-4.5 px-[max(--spacing(5),env(safe-area-inset-left,0px),env(safe-area-inset-right,0px))] py-4";

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <section aria-labelledby="project-title">
      <div className={THUMBNAIL_CLASS}>
        <Image
          src={project.thumbnailUrl}
          alt={`${project.title} 썸네일`}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          loading="eager"
          className="object-cover"
        />
      </div>
      <div className={CONTENT_CLASS}>
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

// 썸네일·제목·팀명·소개 자리를 실제와 같은 높이로 잡음
export function ProjectOverviewSkeleton() {
  return (
    <div aria-hidden className="motion-safe:animate-pulse">
      <div className={cn(THUMBNAIL_CLASS, "bg-muted")} />
      <div className={CONTENT_CLASS}>
        <div className="flex w-full flex-col gap-0.5">
          {/* 제목 줄 높이는 같은 줄의 플랫폼 배지가 정함 */}
          <div className="flex min-h-7.25 items-center justify-between gap-3 text-title-sb-20">
            <div className="h-6 w-1/2 rounded-sm bg-muted" />
            <div className="h-7.25 w-12 rounded-sm bg-muted" />
          </div>
          <div className="flex h-lh items-center text-body-m-16">
            <div className="h-4 w-1/4 rounded-sm bg-muted" />
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="flex h-lh items-center text-body-m-16">
            <div className="h-4 w-full rounded-sm bg-muted" />
          </div>
          <div>
            <div className="flex h-lh items-center text-body-r-14">
              <div className="h-3.5 w-5/6 rounded-sm bg-muted" />
            </div>
            <div className="flex h-lh items-center text-body-r-14">
              <div className="h-3.5 w-2/3 rounded-sm bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
