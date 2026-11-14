import { mockNow, mockResponse } from "@/shared/api/mock";

import type { Stamp } from "../types";
import { MOCK_USER_ID, mockStamps } from "./stamp.mock";

// TODO: 서버 API가 나오면 api.get/post("...")로 교체한다.
export function getMyStamps(): Promise<Stamp[]> {
  return mockResponse(mockStamps.filter((stamp) => stamp.userId === MOCK_USER_ID));
}

/** 같은 부스 스탬프는 한 번만 받을 수 있다. (서버 unique 제약) */
export function createStamp(boothId: number): Promise<Stamp> {
  const exists = mockStamps.some((stamp) => stamp.userId === MOCK_USER_ID && stamp.boothId === boothId);
  if (exists) return Promise.reject(new Error("이미 스탬프를 받은 부스입니다."));

  const now = mockNow();
  const stamp: Stamp = { id: mockStamps.length + 1, createdAt: now, updatedAt: now, userId: MOCK_USER_ID, boothId };
  mockStamps.push(stamp);
  return mockResponse(stamp);
}
