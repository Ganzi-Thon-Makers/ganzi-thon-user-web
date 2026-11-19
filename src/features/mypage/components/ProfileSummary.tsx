import Image from "next/image";

import type { MyPageResponse } from "../types";

type ProfileSummaryProps = MyPageResponse;

export function ProfileSummary({ name, loginId }: ProfileSummaryProps) {
  return (
    <header className="flex items-center gap-4">
      <Image src="/profile.webp" alt="" width={78} height={78} loading="eager" className="size-19.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-body-m-16 wrap-anywhere break-keep text-gray50">{name}</p>
        <p className="text-body-r-16 wrap-anywhere text-gray300">ID : {loginId}</p>
      </div>
    </header>
  );
}
