import { queryOptions } from "@tanstack/react-query";

import { getProject, getProjects } from "./project.api";

export const projectQueries = {
  all: () => ["projects"] as const,
  list: () => queryOptions({ queryKey: [...projectQueries.all(), "list"], queryFn: getProjects }),
  detail: (id: number) =>
    queryOptions({ queryKey: [...projectQueries.all(), "detail", id], queryFn: () => getProject(id) }),
};
