import { NavigationLayout } from "@/shared/components/NavigationLayout";
import { BottomNavigation } from "@/shared/ui/BottomNavigation";

export default function TabsLayout({ children }: LayoutProps<"/">) {
  return <NavigationLayout navigation={<BottomNavigation />}>{children}</NavigationLayout>;
}
