"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "../lib/cn";
import { CardIcon, ClockIcon, HouseIcon, QrIcon, StampIcon, UserIcon } from "./icons";

const stampPath = "/stamp";

const leadingRoutes = [
  { name: "타임라인", path: "/timeline", Icon: ClockIcon },
  { name: "부스", path: "/booths", Icon: HouseIcon },
];

const trailingRoutes = [
  { name: "프로젝트", path: "/projects", Icon: CardIcon },
  { name: "마이", path: "/mypage", Icon: UserIcon },
];

interface NavigationLinksProps {
  routes: typeof leadingRoutes;
  pathname: string;
}

function NavigationLinks({ routes, pathname }: NavigationLinksProps) {
  return (
    <div className="relative grid min-w-0 flex-1 grid-cols-2 gap-4 pt-3 pb-6">
      {routes.map(({ name, path, Icon }) => {
        const isActive = pathname === path || pathname.startsWith(`${path}/`);

        return (
          <Link
            key={path}
            href={path}
            className={cn(
              "flex flex-col items-center text-caption-m-12 whitespace-nowrap text-gray600",
              isActive && "text-gray200",
            )}
          >
            <Icon className="text-inherit" />
            <span>{name}</span>
          </Link>
        );
      })}
    </div>
  );
}

interface BottomNavigationProps {
  onQrClick?: () => void;
}

const centerButtonClassName =
  "flex size-16 flex-col items-center justify-center rounded-full bg-red500 text-caption-m-12";

export function BottomNavigation({ onQrClick }: BottomNavigationProps) {
  const pathname = usePathname();
  const isStampPage = pathname === stampPath;

  return (
    <nav className="sticky bottom-0 z-10 -mt-(--nav-cutout-depth) flex w-full shrink-0 gap-4 px-6">
      <div className="pointer-events-none absolute inset-0 rounded-t-[20px] bg-gray800 mask-[radial-gradient(circle_at_50%_19px,transparent_39.5px,black_40px)]" />
      <NavigationLinks routes={leadingRoutes} pathname={pathname} />
      <div className="relative -mt-3.25 flex w-20 shrink-0 justify-center">
        {isStampPage ? (
          <button type="button" onClick={onQrClick} className={cn(centerButtonClassName, "text-white")}>
            <QrIcon className="text-inherit" />
            <span>QR</span>
          </button>
        ) : (
          <Link href={stampPath} className={cn(centerButtonClassName, "text-red200")}>
            <StampIcon className="text-inherit" />
            <span>스탬프</span>
          </Link>
        )}
      </div>
      <NavigationLinks routes={trailingRoutes} pathname={pathname} />
    </nav>
  );
}
