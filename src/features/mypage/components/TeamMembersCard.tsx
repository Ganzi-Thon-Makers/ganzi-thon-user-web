import type { Part } from "@/shared/api/types";
import { Badge } from "@/shared/ui/Badge";

import type { MyPageResponse } from "../types";

type TeamMembersCardProps = MyPageResponse;

const PART_ORDER = ["PLAN", "DESIGN", "WEB", "SERVER", "APP"] as const satisfies readonly Part[];

export function TeamMembersCard({ teamNumber, teamMemberList }: TeamMembersCardProps) {
  const memberNamesByPart = new Map<Part, string[]>();

  for (const { part, name } of teamMemberList) {
    const names = memberNamesByPart.get(part);

    if (names) {
      names.push(name);
      continue;
    }

    memberNamesByPart.set(part, [name]);
  }

  return (
    <section aria-labelledby="mypage-team" className="rounded-lg bg-gray800 px-5 py-4.25">
      <h2 id="mypage-team" className="sr-only">
        팀 정보
      </h2>
      <Badge variant="secondary">{teamNumber}팀</Badge>
      <dl className="mt-2 flex flex-col gap-2">
        {PART_ORDER.map((part) => {
          const names = memberNamesByPart.get(part);
          if (!names) return null;

          return (
            <div key={part} className="flex flex-wrap items-baseline gap-x-3.25 gap-y-1">
              <dt className="text-body-sb-16 text-gray50">{part}</dt>
              <dd className="max-w-full min-w-0">
                <ul className="flex flex-wrap gap-x-2 gap-y-1 text-body-r-14 text-gray300">
                  {names.map((name, index) => (
                    // 동명이인의 경우를 막기 위해 index를 key에 추가
                    // oxlint-disable-next-line react/no-array-index-key
                    <li key={`${name}-${index}`} className="min-w-0 wrap-anywhere break-keep">
                      {name}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
