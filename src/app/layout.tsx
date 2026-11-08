import type { Metadata } from "next";

import "@/styles/globals.css";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "FE Boilerplate",
  description: "Next.js + TanStack Query + Base UI",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: 브라우저 확장이 html·body에 붙이는 속성 차이만 무시한다. (자식은 계속 검사)
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full" suppressHydrationWarning>
        {/* .root: Base UI 팝업(Dialog, Popover 등)이 항상 위에 뜨도록 stacking context를 분리한다. */}
        <div className="root flex min-h-full flex-col">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
