import type { Metadata } from "next";

import { env } from "@/shared/config/env";

import "@/styles/globals.css";

import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  // 운영 배포만 검색 노출. robots.txt로 막으면 카톡 등 링크 미리보기 수집도 막혀서 noindex 사용
  robots: env.IS_PRODUCTION_DEPLOY ? undefined : { index: false, follow: false },
  title: "양갱즈",
  description: "2026 간지톤 참가자를 위한 서비스",
  openGraph: {
    title: "양갱즈",
    description: "2026 간지톤 참가자를 위한 서비스",
  },
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
