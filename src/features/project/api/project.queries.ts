import { queryOptions } from "@tanstack/react-query";

import type { Zone } from "../types";
import { getProjects } from "./project.api";

export const projectQueries = {
  all: () => ["projects"] as const,
  list: (zone: Zone) =>
    queryOptions({ queryKey: [...projectQueries.all(), "list", zone], queryFn: () => getProjects(zone) }),
};
