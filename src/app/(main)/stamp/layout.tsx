import { StampNavigation } from "@/features/stamp/components/StampNavigation";

import { NavigationLayout } from "../NavigationLayout";

export default function StampLayout({ children }: LayoutProps<"/stamp">) {
  return <NavigationLayout navigation={<StampNavigation />}>{children}</NavigationLayout>;
}
