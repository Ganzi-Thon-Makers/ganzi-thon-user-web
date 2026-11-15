import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

interface PageShellProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

// 헤더는 스크롤 밖에 고정하고 본문만 스크롤. footer는 본문 위에 겹쳐 하단에 고정
// 하단 내비게이션이 있으면 layout이 가려지는 높이(--page-inset-bottom)와 본문 끝 여유(--page-content-clearance)를 알려줌
export function PageShell({ header, footer, children }: PageShellProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col [--shell-inset-bottom:var(--page-inset-bottom,env(safe-area-inset-bottom,0px))]">
      {header && <div className="shrink-0 pt-[env(safe-area-inset-top,0px)]">{header}</div>}
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-y-auto",
          // 키보드 포커스가 하단 내비게이션·footer 아래로 숨지 않게 스크롤 기준을 올림 (footer 기본 높이 = 여백 70px + 버튼 48px)
          footer ? "scroll-pb-[calc(var(--shell-inset-bottom)+--spacing(29.5))]" : "scroll-pb-(--shell-inset-bottom)",
        )}
      >
        <div
          className={cn(
            "flex-1 px-[max(--spacing(4),env(safe-area-inset-left,0px),env(safe-area-inset-right,0px))] pb-(--page-content-clearance,0px)",
            !header && "pt-[max(--spacing(10),env(safe-area-inset-top,0px))]",
          )}
        >
          {children}
        </div>
        {/* 스크롤 영역에 padding을 두지 않음(sticky 기준 반영이 엔진마다 다름). footer는 가려지는 높이까지 배경을 깔아 내비게이션 홈 사이로 본문이 비치지 않게 함 */}
        {footer ? (
          <div className="sticky bottom-0 bg-linear-to-b from-transparent to-black px-[max(--spacing(5),env(safe-area-inset-left,0px),env(safe-area-inset-right,0px))] pt-11.5 pb-[calc(--spacing(6)+var(--shell-inset-bottom))] backdrop-blur-2xs">
            {footer}
          </div>
        ) : (
          <div aria-hidden className="h-(--shell-inset-bottom) shrink-0" />
        )}
      </div>
    </div>
  );
}
