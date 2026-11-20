import { ModalTrigger } from "@/shared/ui/Modal";

import type { BoothListItem, BoothRoom } from "../types";
import { BoothButton } from "./BoothButton";

interface BoothColumnProps {
  booths: BoothListItem[];
}

function BoothColumn({ booths }: BoothColumnProps) {
  return (
    <ul className="flex flex-col gap-3">
      {booths.map((booth) => (
        <li key={booth.boothId}>
          <ModalTrigger render={<BoothButton />} payload={booth}>
            {booth.teamNumber}팀
          </ModalTrigger>
        </li>
      ))}
    </ul>
  );
}

interface BoothRoomMapProps {
  room: BoothRoom;
}

export function BoothRoomMap({ room }: BoothRoomMapProps) {
  const leftBooths = room.booths.filter((_, index) => index % 2 === 0);
  const rightBooths = room.booths.filter((_, index) => index % 2 === 1);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 items-center justify-between gap-3 py-2">
        <BoothColumn booths={leftBooths} />
        <BoothColumn booths={rightBooths} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-body-sb-14">입구</p>
        <div className="h-0.75 w-21.5 rounded-full bg-gray600" />
      </div>
    </div>
  );
}
