import type { Part } from "@/shared/api/types";

// 서버 Zone enum. 기능 명세서 PROJ-01-1: 3구역, 구역별 10팀
export const ZONES = ["ZONE1", "ZONE2", "ZONE3"] as const;
export type Zone = (typeof ZONES)[number];

export const ZONE_LABELS = {
  ZONE1: "Zone1",
  ZONE2: "Zone2",
  ZONE3: "Zone3",
} satisfies Record<Zone, string>;

export type Platform = "WEB" | "APP";

/** 서버 ProjectSummaryResponse 중 화면이 쓰는 필드 */
export interface Project {
  id: number;
  title: string;
  summary: string;
  thumbnailUrl: string;
  platform: Platform;
  /** 로그인한 사용자가 이 프로젝트에 투표했는지 */
  isVoted: boolean;
}

export type ProjectsByZone = Partial<Record<Zone, Project[]>>;

export interface PartMembers {
  part: Part;
  names: string[];
}

/** 서버 ProjectDetailResponse 중 화면이 쓰는 필드 */
export interface ProjectDetail extends Omit<Project, "isVoted"> {
  teamName: string;
  description: string;
  serviceUrl: string | null;
  techStack: string;
  members: PartMembers[];
}

export type VoteStatus = "NOT_STARTED" | "IN_PROGRESS" | "PAUSED" | "ENDED";

/** 서버 VotePeriodResponse 중 화면이 쓰는 필드. 일정 미등록이면 NOT_STARTED + startTime null */
export interface VotePeriod {
  status: VoteStatus;
  startTime: string | null;
  endTime: string | null;
  serverTime: string;
}
