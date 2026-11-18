import { Badge } from "@/shared/ui/Badge";

import type { MyPageTeam } from "../types";

interface TeamMembersCardProps {
  team: MyPageTeam;
}

export function TeamMembersCard({ team }: TeamMembersCardProps) {
  return (
    <section aria-labelledby="mypage-team" className="rounded-lg bg-gray800 px-5 py-4.25">
      <h2 id="mypage-team" className="sr-only">
        팀 정보
      </h2>
      <Badge variant="secondary">{team.name}</Badge>
      <dl className="mt-2 flex flex-col gap-2">
        {team.memberGroups.map(({ part, members }) => (
          <div key={part} className="flex flex-wrap items-baseline gap-x-3.25 gap-y-1">
            <dt className="text-body-sb-16 text-gray50">{part}</dt>
            <dd className="max-w-full min-w-0">
              <ul className="flex flex-wrap gap-x-2 gap-y-1 text-body-r-14 text-gray300">
                {members.map(({ id, name }) => (
                  <li key={id} className="min-w-0 wrap-anywhere break-keep">
                    {name}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
