import { MyPage } from "@/features/mypage/pages/MyPage";
import { PageBoundary } from "@/shared/components/PageBoundary";

export default function Page() {
  return (
    <PageBoundary>
      <MyPage />
    </PageBoundary>
  );
}
