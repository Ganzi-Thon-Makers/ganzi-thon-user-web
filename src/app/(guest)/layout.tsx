export default function GuestLayout({ children }: LayoutProps<"/">) {
  return <main className="mx-auto flex h-dvh w-full max-w-3xl flex-col">{children}</main>;
}
