import { mockResponse } from "@/shared/api/mock";

import type { BoothZone } from "../types";
import { mockBoothZones } from "./booth.mock";

export function getBoothZones(): Promise<BoothZone[]> {
  return mockResponse(mockBoothZones);
}
