import { BottomNavigation } from "@/shared/ui/BottomNavigation";

export default function TabsLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <main className="min-h-0 flex-1 overflow-y-auto px-4 pt-10 pb-(--nav-content-padding-bottom)">{children}</main>
      <BottomNavigation />
    </>
  );
}
