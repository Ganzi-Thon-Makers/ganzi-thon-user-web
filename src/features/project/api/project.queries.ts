import { queryOptions } from "@tanstack/react-query";

import type { Zone } from "../types";
import { getProject, getProjects } from "./project.api";

export const projectQueries = {
  all: () => ["projects"] as const,
  list: (zone: Zone) =>
    queryOptions({ queryKey: [...projectQueries.all(), "list", zone], queryFn: () => getProjects(zone) }),
  detail: (id: number) =>
    queryOptions({ queryKey: [...projectQueries.all(), "detail", id], queryFn: () => getProject(id) }),
};
