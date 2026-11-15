import { type Part, PARTS, type ProjectDetail, ZONES } from "../types";

// TODO: 서버 API가 나오면 실제 응답으로 교체한다. 문구는 Figma 시안 기준 임시 값이다.
const PROJECTS_PER_ZONE = 10;
const MEMBERS_PER_PART = 2;

function createMockMembers(projectId: number) {
  return PARTS.flatMap((part: Part, partIndex) =>
    Array.from({ length: MEMBERS_PER_PART }, (_, index) => ({
      id: projectId * 100 + partIndex * MEMBERS_PER_PART + index,
      name: "김간지",
      part,
    })),
  );
}

export const mockProjects: ProjectDetail[] = ZONES.flatMap((zone, zoneIndex) =>
  Array.from({ length: PROJECTS_PER_ZONE }, (_, index) => {
    const id = zoneIndex * PROJECTS_PER_ZONE + index + 1;
    return {
      id,
      zone,
      title: "Framey",
      teamName: "팀네임최대열다섯",
      summary: "프레미는 사진 프레임을 하는 그런 사용자 서비스입니다",
      description: "상세보기설명".repeat(15),
      serviceUrl: "https://example.com",
      thumbnailUrl: "/thumbnail.webp",
      techStack: "React, Next.js, TypeScript, Node.js, Spring Boot",
      platform: "APP" as const,
      members: createMockMembers(id),
    };
  }),
);
