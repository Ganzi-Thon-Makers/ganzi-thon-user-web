// BottomNavigation이 없는 페이지 구조. 여백·스크롤은 PageShell 담당
export default function StandaloneLayout({ children }: LayoutProps<"/">) {
  return <main className="mx-auto flex h-dvh w-full max-w-3xl flex-col">{children}</main>;
}
