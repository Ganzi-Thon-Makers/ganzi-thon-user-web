import { cn } from "@/shared/lib/cn";

import type { ProjectDetail } from "../types";

interface ProjectTeamInfoProps {
  members: ProjectDetail["members"];
  techStack: string;
}

const CONTAINER_CLASS =
  "flex flex-col gap-5 px-[max(--spacing(4),env(safe-area-inset-left,0px),env(safe-area-inset-right,0px))] py-4";
const MEMBERS_BOX_CLASS = "rounded-lg bg-gray800 px-4 py-4.25";

export function ProjectTeamInfo({ members, techStack }: ProjectTeamInfoProps) {
  const parts = members.filter((group) => group.names.length > 0);

  return (
    <div className={CONTAINER_CLASS}>
      <section aria-labelledby="project-members-title" className={MEMBERS_BOX_CLASS}>
        <h3 id="project-members-title" className="sr-only">
          팀원
        </h3>
        <dl className="flex flex-col gap-2">
          {parts.map((group) => (
            <div key={group.part} className="flex items-center gap-3.25">
              <dt className="text-body-sb-16 text-gray50">{group.part}</dt>
              {/* 이름 사이 공백 문자로 띄어 스크린 리더가 붙여 읽지 않게 함 */}
              <dd className="text-body-r-14 text-gray300">{group.names.join(" ")}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section aria-labelledby="project-tech-title" className="flex flex-col gap-1 px-2">
        <h3 id="project-tech-title" className="text-body-sb-16 text-gray50">
          기술 스택
        </h3>
        <p className="text-body-m-14 wrap-break-word text-gray300">{techStack}</p>
      </section>
    </div>
  );
}

const SKELETON_PART_COUNT = 4;

// 팀원 박스와 기술 스택 자리를 실제와 같은 배치로 잡음
export function ProjectTeamInfoSkeleton() {
  return (
    <div aria-hidden className={cn(CONTAINER_CLASS, "motion-safe:animate-pulse")}>
      <div className={cn(MEMBERS_BOX_CLASS, "flex flex-col gap-2")}>
        {Array.from({ length: SKELETON_PART_COUNT }, (_, index) => (
          <div key={index} className="flex h-lh items-center text-body-sb-16">
            <div className="h-4 w-2/3 rounded-sm bg-gray700" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1 px-2">
        <div className="flex h-lh items-center text-body-sb-16">
          <div className="h-4 w-20 rounded-sm bg-muted" />
        </div>
        <div className="flex h-lh items-center text-body-m-14">
          <div className="h-3.5 w-1/2 rounded-sm bg-muted" />
        </div>
      </div>
    </div>
  );
}
