import type { Project, Zone } from "../types";
import { mockProjects } from "./project.mock";

// TODO: 서버 API가 나오면 api.get("...")으로 교체한다.
export function getProjects(zone: Zone): Promise<Project[]> {
  return Promise.resolve(mockProjects.filter((project) => project.zone === zone));
}
