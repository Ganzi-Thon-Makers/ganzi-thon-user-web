import { BottomNavigation } from "@/shared/ui/BottomNavigation";

import { NavigationLayout } from "../NavigationLayout";

export default function TabsLayout({ children }: LayoutProps<"/">) {
  return <NavigationLayout navigation={<BottomNavigation />}>{children}</NavigationLayout>;
}
