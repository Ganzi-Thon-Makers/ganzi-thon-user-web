import { queryOptions } from "@tanstack/react-query";

import { getBoothZones } from "./booth.api";
import { selectBoothZones } from "./booth.select";

export const boothQueries = {
  all: () => ["booths"] as const,
  list: () =>
    queryOptions({
      queryKey: [...boothQueries.all(), "list"],
      queryFn: getBoothZones,
      select: selectBoothZones,
    }),
};
