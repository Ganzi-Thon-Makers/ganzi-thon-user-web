import { mockResponse } from "@/shared/api/mock";

import type { TimelineEvent } from "../types";
import { mockTimelineResponse } from "./timeline.mock";

// TODO: 타임라인 API 계약이 확정되면 서버 요청으로 교체한다.
export async function getTimelineEvents(): Promise<TimelineEvent[]> {
  const { data } = await mockResponse(mockTimelineResponse);
  return data;
}
