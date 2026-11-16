import Image from "next/image";

import { Badge } from "@/shared/ui/Badge";
import { ModalDescription, ModalTitle } from "@/shared/ui/Modal";

import type { Booth } from "../types";

interface BoothDetailSummaryProps {
  booth: Pick<Booth, "thumbnailUrl" | "title" | "teamName" | "summary" | "platform">;
}

export function BoothDetailSummary({
  booth: { thumbnailUrl, title, teamName, summary, platform },
}: BoothDetailSummaryProps) {
  return (
    <article className="pointer-events-auto rounded-lg bg-gray800">
      <div className="relative h-50.5 overflow-hidden rounded-t-lg">
        <Image
          src={thumbnailUrl}
          alt={`${title} 썸네일`}
          fill
          sizes="(max-width: 544px) calc(100vw - 2.5rem), 504px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-4 px-5 pt-6 pb-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <ModalTitle className="min-w-0 text-title-sb-20 wrap-break-word">{title}</ModalTitle>
            <Badge>{platform}</Badge>
          </div>
          <p className="text-body-m-16 wrap-break-word text-gray300">{teamName}</p>
        </div>
        <ModalDescription className="text-body-m-16 wrap-break-word text-gray50">{summary}</ModalDescription>
      </div>
    </article>
  );
}
