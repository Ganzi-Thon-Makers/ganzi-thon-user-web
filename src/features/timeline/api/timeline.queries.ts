import { queryOptions } from "@tanstack/react-query";

import { getTimelineEvents } from "./timeline.api";

export const timelineQueries = {
  all: () => ["timeline"] as const,
  list: () => queryOptions({ queryKey: [...timelineQueries.all(), "list"], queryFn: getTimelineEvents }),
};
