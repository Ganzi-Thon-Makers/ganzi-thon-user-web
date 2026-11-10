export default function MainLayout({ children }: LayoutProps<"/">) {
  // 본문과 네비가 파임 깊이를 공유하고, 본문 하단에 버튼이 튀어나온 높이만큼 여백을 더 둠
  return (
    <div className="mx-auto flex h-dvh w-full max-w-3xl flex-col [--nav-content-padding-bottom:calc(var(--nav-cutout-depth)+13px)] [--nav-cutout-depth:59px]">
      {children}
    </div>
  );
}
