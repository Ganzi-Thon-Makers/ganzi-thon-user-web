import type { ProjectDetail } from "../types";

interface ProjectTeamInfoProps {
  members: ProjectDetail["members"];
  techStack: string;
}

export function ProjectTeamInfo({ members, techStack }: ProjectTeamInfoProps) {
  const parts = members.filter((group) => group.names.length > 0);

  return (
    <div className="flex flex-col gap-5 px-[max(--spacing(4),env(safe-area-inset-left,0px),env(safe-area-inset-right,0px))] py-4">
      <section aria-labelledby="project-members-title" className="rounded-lg bg-gray800 px-4 py-4.25">
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
