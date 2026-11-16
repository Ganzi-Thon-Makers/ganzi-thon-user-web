import { queryOptions } from "@tanstack/react-query";

import { getBoothZones } from "./booth.api";

export const boothQueries = {
  all: () => ["booths"] as const,
  list: () => queryOptions({ queryKey: [...boothQueries.all(), "list"], queryFn: getBoothZones }),
};
