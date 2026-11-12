import Image from "next/image";

interface ProjectDetailSummaryProps {
  thumbnailSrc: string;
  name: string;
  teamName: string;
  summary: string;
  platform: "WEB" | "APP";
}

// 닫기 버튼과 팝업 틀은 감싸는 쪽 담당
export function ProjectDetailSummary({ thumbnailSrc, name, teamName, summary, platform }: ProjectDetailSummaryProps) {
  return (
    <article className="flex flex-col gap-6 overflow-hidden rounded-lg bg-gray800 pb-5">
      <div className="relative h-50.5 shrink-0">
        <Image src={thumbnailSrc} alt="" fill sizes="(max-width: 480px) 100vw, 480px" className="object-cover" />
      </div>
      <div className="flex flex-col gap-3 px-4">
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <h2 className="min-w-0 text-title-sb-20 wrap-break-word text-gray50">{name}</h2>
            <span className="shrink-0 rounded-sm bg-red500 px-3 py-1 text-body-sb-14 text-white">{platform}</span>
          </div>
          <p className="truncate text-body-m-16 text-gray300">{teamName}</p>
        </div>
        <p className="text-body-m-16 wrap-break-word text-gray50">{summary}</p>
      </div>
    </article>
  );
}
