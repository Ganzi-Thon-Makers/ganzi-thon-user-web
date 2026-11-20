import type { ReactNode } from "react";

interface NavigationLayoutProps {
  children: ReactNode;
  navigation: ReactNode;
}

// 스크롤·여백은 PageShell이 맡고, 여기서는 내비게이션에 가려지는 높이만 알려줌
export function NavigationLayout({ children, navigation }: NavigationLayoutProps) {
  return (
    <>
      <main className="flex min-h-0 flex-1 flex-col bottom-navigation-metrics [--page-content-clearance:var(--nav-button-overhang)] [--page-inset-bottom:var(--nav-cutout-depth)]">
        {children}
      </main>
      {navigation}
    </>
  );
}
