import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";

import { Badge } from "@/shared/ui/Badge";
import { ModalDescription, ModalTitle } from "@/shared/ui/Modal";

import { boothQueries } from "../api/booth.queries";

interface BoothDetailSummaryProps {
  boothId: number;
}

export function BoothDetailSummary({ boothId }: BoothDetailSummaryProps) {
  const { data } = useSuspenseQuery(boothQueries.detail(boothId));

  return (
    <article className="pointer-events-auto rounded-lg bg-gray800">
      <div className="relative h-50.5 overflow-hidden rounded-t-lg">
        <Image
          src={data.thumbnailUrl}
          alt={`${data.title} 썸네일`}
          fill
          sizes="(max-width: 544px) calc(100vw - 2.5rem), 504px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-4 px-5 pt-6 pb-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <ModalTitle className="min-w-0 text-title-sb-20 wrap-break-word">{data.title}</ModalTitle>
            <Badge>{data.platform}</Badge>
          </div>
          <p className="text-body-m-16 wrap-break-word text-gray300">{data.teamName}</p>
        </div>
        <ModalDescription className="text-body-m-16 wrap-break-word text-gray50">{data.summary}</ModalDescription>
      </div>
    </article>
  );
}
