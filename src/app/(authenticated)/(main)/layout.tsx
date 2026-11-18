import type { Viewport } from "next";

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function MainLayout({ children }: LayoutProps<"/">) {
  return <div className="mx-auto flex h-dvh w-full max-w-3xl flex-col">{children}</div>;
}
