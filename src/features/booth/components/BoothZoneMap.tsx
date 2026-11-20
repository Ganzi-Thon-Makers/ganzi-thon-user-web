import { cn } from "@/shared/lib/cn";
import { TabIndicator, TabList, TabPanel, TabRoot, TabTrigger } from "@/shared/ui/Tab";

import type { BoothRoom, BoothZone, BoothZoneCode } from "../types";
import { BoothDetailModal } from "./BoothDetailModal";
import { BoothRoomMap } from "./BoothRoomMap";
import { ClassroomTabList } from "./ClassroomTabList";

// 키보드로 이동할 때 포커스된 요소가 위에 붙은 Zone 탭(h-12) 아래로 숨지 않게 함
const MAP_PANEL_CLASS = "mx-1.5 mt-4.5 [&_:focus-visible]:scroll-mt-12";
const MAP_ROOM_CLASS = "flex min-h-112.5 flex-col rounded-lg bg-gray800 p-5";
const ROOM_LABEL_CLASS = "mx-auto rounded-full py-1.5 text-body-sb-14";
const ZONE_LABELS: Record<BoothZoneCode, string> = { ZONE1: "Zone1", ZONE2: "Zone2", ZONE3: "Zone3" };

interface ZoneRoomsProps {
  rooms: BoothRoom[];
  defaultRoomNumber?: string;
}

function ZoneRooms({ rooms, defaultRoomNumber }: ZoneRoomsProps) {
  const firstRoom = rooms[0];

  if (!firstRoom) return <p>등록된 호실이 없어요</p>;

  return (
    <div className={MAP_ROOM_CLASS}>
      {rooms.length === 1 ? (
        <>
          <h2 className={cn(ROOM_LABEL_CLASS, "bg-gray500 px-3 text-white")}>{firstRoom.number}호</h2>
          <BoothRoomMap room={firstRoom} />
        </>
      ) : (
        <TabRoot defaultValue={defaultRoomNumber ?? firstRoom.number} className="flex flex-1 flex-col">
          <ClassroomTabList roomNumbers={rooms.map((room) => room.number)} />
          {rooms.map((room) => (
            <TabPanel key={room.number} value={room.number} className="flex flex-1 flex-col">
              <BoothRoomMap room={room} />
            </TabPanel>
          ))}
        </TabRoot>
      )}
    </div>
  );
}

function findBoothLocation(zones: BoothZone[], boothId: number) {
  for (const zone of zones) {
    const room = zone.rooms.find((item) => item.booths.some((booth) => booth.boothId === boothId));
    if (room) return { zoneCode: zone.code, roomNumber: room.number };
  }
  return null;
}

interface BoothZoneMapProps {
  zones: BoothZone[];
  /** 이 부스의 구역·호실을 먼저 보여 주고 상세를 연다. 없는 부스면 무시 */
  initialBoothId?: number;
}

export function BoothZoneMap({ zones, initialBoothId }: BoothZoneMapProps) {
  const firstZone = zones[0];

  if (!firstZone) return <p className="py-5 text-body-r-14">등록된 부스가 없어요</p>;

  const location = initialBoothId === undefined ? null : findBoothLocation(zones, initialBoothId);

  return (
    <BoothDetailModal initialBoothId={location ? initialBoothId : undefined}>
      <TabRoot defaultValue={location?.zoneCode ?? firstZone.code} className="mt-2">
        {/* 지도를 내려 봐도 구역을 바로 바꿀 수 있게 탭만 위에 붙임(배너는 스크롤됨) */}
        <TabList
          aria-label="Zone"
          className="sticky top-[env(safe-area-inset-top,0px)] z-20 -mx-4 w-auto bg-background"
        >
          {zones.map((zone) => (
            <TabTrigger key={zone.code} value={zone.code}>
              {ZONE_LABELS[zone.code]}
            </TabTrigger>
          ))}
          <TabIndicator />
        </TabList>
        {zones.map((zone) => (
          <TabPanel key={zone.code} value={zone.code} className={MAP_PANEL_CLASS}>
            <ZoneRooms
              rooms={zone.rooms}
              defaultRoomNumber={location?.zoneCode === zone.code ? location.roomNumber : undefined}
            />
          </TabPanel>
        ))}
      </TabRoot>
    </BoothDetailModal>
  );
}

function BoothColumnSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="size-18 rounded-sm bg-gray700" />
      ))}
    </div>
  );
}

export function BoothZoneMapSkeleton() {
  return (
    <div className="mt-2">
      <output className="sr-only">부스 배치도를 불러오는 중</output>
      <div aria-hidden>
        <div className="-mx-4 flex">
          {Object.values(ZONE_LABELS).map((label, index) => (
            <span
              key={label}
              className={cn(
                "relative h-12 min-w-0 flex-1 content-center text-center text-body-sb-14 text-gray50",
                index === 0 && "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-red500",
              )}
            >
              {label}
            </span>
          ))}
        </div>
        <div className={cn(MAP_PANEL_CLASS, MAP_ROOM_CLASS, "motion-safe:animate-pulse")}>
          <div className={cn(ROOM_LABEL_CLASS, "w-15 bg-gray700")}>
            <div className="h-lh" />
          </div>
          <div className="flex flex-1 items-center justify-between gap-3 py-2">
            <BoothColumnSkeleton />
            <BoothColumnSkeleton />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-lh w-6 rounded-sm bg-gray700 text-body-sb-14" />
            <div className="h-0.75 w-21.5 rounded-full bg-gray700" />
          </div>
        </div>
      </div>
    </div>
  );
}
