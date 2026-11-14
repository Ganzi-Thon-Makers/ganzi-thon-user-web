"use client";

import { PageShell } from "@/shared/components/PageShell";

export function HomePage() {
  return (
    <PageShell>
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-foreground">Home</h1>
        <p className="text-sm text-muted-foreground">홈 화면입니다.</p>
      </section>
    </PageShell>
  );
}
