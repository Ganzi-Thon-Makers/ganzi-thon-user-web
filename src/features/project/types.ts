// 서버 Booth.zone enum. 기능 명세서 PROJ-01-1: 3구역, 구역별 10팀
export const ZONES = ["ZONE1", "ZONE2", "ZONE3"] as const;
export type Zone = (typeof ZONES)[number];

export const ZONE_LABELS = {
  ZONE1: "Zone1",
  ZONE2: "Zone2",
  ZONE3: "Zone3",
} satisfies Record<Zone, string>;

/** 서버 Project 엔티티 기준. API 응답 형태는 아직 미정이라 화면에 필요한 필드만 둔다. */
export interface Project {
  id: number;
  zone: Zone;
  title: string;
  summary: string;
  thumbnailUrl: string;
  // 서버 엔티티에 없는 필드. 카드 디자인에 있어 임시로 둠 (백엔드 확인 필요)
  platform: "WEB" | "APP";
}

// 서버에 팀원 파트 정보가 없어 Figma 기준으로 둠 (백엔드 확인 필요)
export const PARTS = ["PLAN", "DESIGN", "WEB", "SERVER"] as const;
export type Part = (typeof PARTS)[number];

export interface ProjectMember {
  id: number;
  name: string;
  part: Part;
}

export interface ProjectDetail extends Project {
  teamName: string;
  description: string;
  serviceUrl: string | null;
  techStack: string;
  members: ProjectMember[];
}
