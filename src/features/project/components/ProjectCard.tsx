import Image from "next/image";

import { cn } from "@/shared/lib/cn";

interface ProjectCardProps {
  thumbnailSrc: string;
  name: string;
  summary: string;
  platform: "WEB" | "APP";
  isSelected?: boolean;
  isDisabled?: boolean;
}

// 링크·투표 선택 같은 조작과 그 시맨틱은 감싸는 쪽 담당
export function ProjectCard({
  thumbnailSrc,
  name,
  summary,
  platform,
  isSelected = false,
  isDisabled = false,
}: ProjectCardProps) {
  return (
    <article
      className={cn(
        "flex min-h-45 flex-col gap-3 overflow-hidden rounded-lg bg-gray800 pb-3.5",
        // outline으로 썸네일 위에 테두리 표시, 크기 변화 방지
        isSelected && "outline-2 -outline-offset-2 outline-red300",
        isDisabled && "opacity-50",
      )}
    >
      <div className="relative h-22 shrink-0">
        <Image src={thumbnailSrc} alt="" fill sizes="(max-width: 480px) 50vw, 240px" className="object-cover" />
      </div>
      <div className="flex flex-col gap-1.5 px-2">
        <div className="flex items-end justify-between gap-2">
          <h3 className="min-w-0 truncate text-body-sb-16 text-gray50">{name}</h3>
          <span className="shrink-0 rounded-xs bg-gray700 px-2 py-0.5 text-caption-m-10 text-white">{platform}</span>
        </div>
        <p className="line-clamp-2 text-caption-r-12 text-gray200">{summary}</p>
      </div>
    </article>
  );
}
