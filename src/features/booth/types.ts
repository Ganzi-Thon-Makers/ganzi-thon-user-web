export interface Booth {
  id: number;
  title: string;
}

export interface BoothRoom {
  number: number;
  leftBooths: Booth[];
  rightBooths: Booth[];
}

export type BoothZoneCode = "ZONE1" | "ZONE2" | "ZONE3";

export interface BoothZone {
  code: BoothZoneCode;
  rooms: BoothRoom[];
}
