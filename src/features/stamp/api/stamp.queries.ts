import { queryOptions } from "@tanstack/react-query";

import { getMyStamps, getStampZones } from "./stamp.api";

export const stampQueries = {
  all: () => ["stamps"] as const,
  mine: () => queryOptions({ queryKey: [...stampQueries.all(), "mine"], queryFn: getMyStamps }),
  zones: () => queryOptions({ queryKey: [...stampQueries.all(), "zones"], queryFn: getStampZones }),
};
