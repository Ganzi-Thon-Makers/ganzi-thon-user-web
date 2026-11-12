// BottomNavigation이 없는 페이지 구조
export default function StandaloneLayout({ children }: LayoutProps<"/">) {
  return <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">{children}</main>;
}
