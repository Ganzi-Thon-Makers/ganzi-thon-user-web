"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

import { getAccessTokenRole } from "../api/token";
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
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-col items-center text-caption-m-12 whitespace-nowrap text-gray600",
              isActive && "text-gray200",
            )}
          >
            <Icon />
            <span>{name}</span>
          </Link>
        );
      })}
    </div>
  );
}

// 같은 탭 토큰 변경은 구독하지 않음. 로그인 후엔 내비게이션이 새로 마운트되고, 토큰 없이 401 재발급으로 받은 경우만 새로고침 전까지 반영 안 됨
function subscribeStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

// 서버는 스탬프 적립·조회를 PARTICIPANT만 허용. role을 모르면 기존처럼 표시
function useCanCollectStamp() {
  const role = useSyncExternalStore(subscribeStorage, getAccessTokenRole, () => null);
  return role === null || role === "PARTICIPANT";
}

interface BottomNavigationProps {
  onQrClick?: () => void;
}

const centerButtonClassName =
  "flex size-(--nav-button-size) flex-col items-center justify-center rounded-full bg-red500 text-caption-m-12";

export function BottomNavigation({ onQrClick }: BottomNavigationProps) {
  const pathname = usePathname();
  const hasQrAction = onQrClick !== undefined;
  const canCollectStamp = useCanCollectStamp();

  return (
    <nav className="sticky bottom-0 z-10 -mt-(--nav-cutout-depth) flex w-full shrink-0 gap-4 px-[max(--spacing(6),var(--nav-safe-inline))] pb-[env(safe-area-inset-bottom,0px)] bottom-navigation-metrics [view-transition-name:bottom-nav]">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-t-[20px] bg-gray800",
          canCollectStamp && "mask-(--nav-cutout-mask)",
        )}
      />
      <NavigationLinks routes={leadingRoutes} pathname={pathname} />
      {canCollectStamp && (
        <div className="relative -mt-(--nav-button-overhang) flex w-(--nav-cutout-size) shrink-0 justify-center">
          {hasQrAction ? (
            <button type="button" onClick={onQrClick} className={cn(centerButtonClassName, "text-white")}>
              <QrIcon />
              <span>QR</span>
            </button>
          ) : (
            <Link href={stampPath} className={cn(centerButtonClassName, "text-red200")}>
              <StampIcon />
              <span>스탬프</span>
            </Link>
          )}
        </div>
      )}
      <NavigationLinks routes={trailingRoutes} pathname={pathname} />
    </nav>
  );
}
