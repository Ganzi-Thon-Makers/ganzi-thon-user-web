import { HomePage } from "@/features/home/pages/HomePage";
import { PageBoundary } from "@/shared/components/PageBoundary";

export default function Page() {
  return (
    <PageBoundary>
      <HomePage />
    </PageBoundary>
  );
}
