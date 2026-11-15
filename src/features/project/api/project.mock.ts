import { type Project, ZONES } from "../types";

// TODO: 서버 API가 나오면 실제 응답으로 교체한다. 문구는 Figma 시안 기준 임시 값이다.
const PROJECTS_PER_ZONE = 10;

export const mockProjects: Project[] = ZONES.flatMap((zone, zoneIndex) =>
  Array.from({ length: PROJECTS_PER_ZONE }, (_, index) => ({
    id: zoneIndex * PROJECTS_PER_ZONE + index + 1,
    zone,
    title: "Framey",
    summary: "프레미는 사진 프레임을 하는 그런 사용자 서비스입니다",
    platform: "APP" as const,
    thumbnailUrl: "/thumbnail.webp",
  })),
);
