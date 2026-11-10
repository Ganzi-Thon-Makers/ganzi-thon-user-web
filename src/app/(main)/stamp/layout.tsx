import { StampNavigation } from "@/features/stamp/components/StampNavigation";

export default function StampLayout({ children }: LayoutProps<"/stamp">) {
  return (
    <>
      <main className="min-h-0 flex-1 overflow-y-auto px-4 pt-10 pb-(--nav-content-padding-bottom)">{children}</main>
      <StampNavigation />
    </>
  );
}
