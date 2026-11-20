"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, ViewTransition } from "react";

interface NavigationLayoutProps {
  children: ReactNode;
  navigation: ReactNode;
}

// 스크롤·여백은 PageShell이 맡고, 여기서는 내비게이션에 가려지는 높이만 알려줌
export function NavigationLayout({ children, navigation }: NavigationLayoutProps) {
  const pathname = usePathname();

  return (
    <>
      <main className="flex min-h-0 flex-1 flex-col bottom-navigation-metrics [--page-content-clearance:var(--nav-button-overhang)] [--page-inset-bottom:var(--nav-cutout-depth)]">
        {/* 탭을 옮길 때만 본문을 짧게 디졸브(globals.css의 page-fade). 쿼리만 바뀌면 애니메이션 없음 */}
        <ViewTransition key={pathname} enter="page-fade" exit="page-fade" default="none">
          {children}
        </ViewTransition>
      </main>
      {navigation}
    </>
  );
}
