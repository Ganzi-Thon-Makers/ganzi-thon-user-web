import type { Stamp } from "./types";

/** 테스트용 스탬프. id는 boothId와 같게 둔다. */
export function makeStamp(boothId: number): Stamp {
  return { id: boothId, createdAt: "2026-11-21T13:00:00", updatedAt: "2026-11-21T13:00:00", userId: 1, boothId };
}
