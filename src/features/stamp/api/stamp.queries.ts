import { queryOptions } from "@tanstack/react-query";

import { getMyStamps } from "./stamp.api";

export const stampQueries = {
  all: () => ["stamps"] as const,
  mine: () => queryOptions({ queryKey: [...stampQueries.all(), "mine"], queryFn: getMyStamps }),
};
