import type { ReactNode } from "react";

interface NavigationLayoutProps {
  children: ReactNode;
  navigation: ReactNode;
}

export function NavigationLayout({ children, navigation }: NavigationLayoutProps) {
  return (
    <>
      <main className="min-h-0 flex-1 overflow-y-auto px-[max(--spacing(4),var(--nav-safe-inline))] pt-[max(--spacing(10),env(safe-area-inset-top,0px))] pb-(--nav-content-padding-bottom) bottom-navigation-metrics">
        {children}
      </main>
      {navigation}
    </>
  );
}
