import { BoothPage } from "@/features/booth/pages/BoothPage";
import { PageBoundary } from "@/shared/components/PageBoundary";
import { PageShell } from "@/shared/components/PageShell";

export default function Page() {
  return (
    <PageBoundary clientOnly={false}>
      <PageShell>
        <BoothPage />
      </PageShell>
    </PageBoundary>
  );
}
