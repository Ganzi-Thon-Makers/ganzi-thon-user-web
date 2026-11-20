export interface Booth {
  id: number;
  title: string;
  teamName: string;
  summary: string;
  thumbnailUrl: string;
  platform: "WEB" | "APP";
}

export const BOOTH_ZONE_CODES = ["ZONE1", "ZONE2", "ZONE3"] as const;

export type BoothZoneCode = (typeof BOOTH_ZONE_CODES)[number];

export interface BoothListItem {
  boothId: number;
  boothNumber: number;
  teamNumber: number | null;
  roomNumber: string;
}

export interface BoothListResponse {
  booths: Record<BoothZoneCode, BoothListItem[]>;
}

export interface BoothRoom {
  number: string;
  booths: BoothListItem[];
}

export interface BoothZone {
  code: BoothZoneCode;
  rooms: BoothRoom[];
}
