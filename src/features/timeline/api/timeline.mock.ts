import type { TimelineResponse } from "../types";

export const mockTimelineResponse: TimelineResponse = {
  data: [
    {
      id: 1,
      startTime: "2026-11-21T09:30:00",
      endTime: "2026-11-21T10:30:00",
      title: "참가자 입장 및 세팅",
      description: "출석 체크, 명찰·스탬프판 수령, 지정 부스 세팅",
    },
    {
      id: 2,
      startTime: "2026-11-21T10:30:00",
      endTime: "2026-11-21T11:00:00",
      title: "오프닝 및 오리엔테이션",
      description: "개회 선언 및 행사·심사 규칙 안내",
    },
    {
      id: 3,
      startTime: "2026-11-21T11:00:00",
      endTime: "2026-11-21T13:00:00",
      title: "1차 심사위원 평가",
      description: "팀 전원 부스 상주, 심사위원 3개 조 순회, 팀당 5분",
    },
    {
      id: 4,
      startTime: "2026-11-21T13:00:00",
      endTime: "2026-11-21T14:00:00",
      title: "점심 식사",
      description: "햄버거 세트 제공, 지정 구역 분리수거 필수",
    },
    {
      id: 5,
      startTime: "2026-11-21T14:00:00",
      endTime: "2026-11-21T16:00:00",
      title: "2차 스탬프 투어",
      description: "최소 2인 부스 상주, 타 부스 관람·미션·인기상 투표",
    },
    {
      id: 6,
      startTime: "2026-11-21T16:00:00",
      endTime: "2026-11-21T17:00:00",
      title: "럭키드로우 및 결선 발표",
      description: "스탬프판 제출자 추첨, 결선 진출 5팀 발표",
    },
    {
      id: 7,
      startTime: "2026-11-21T17:00:00",
      endTime: "2026-11-21T18:30:00",
      title: "우수 팀 결선 피칭",
      description: "상위 5개 팀 메인 무대 발표, 팀당 8–10분",
    },
    {
      id: 8,
      startTime: "2026-11-21T18:30:00",
      endTime: "2026-11-21T19:00:00",
      title: "미니 이벤트 및 최종 집계",
      description: "미니 네트워킹 이벤트",
    },
    {
      id: 9,
      startTime: "2026-11-21T19:00:00",
      endTime: "2026-11-21T19:30:00",
      title: "시상식 및 폐회사",
      description: "본상·인기상 시상 및 단체 사진 촬영",
    },
    {
      id: 10,
      startTime: "2026-11-21T19:30:00",
      endTime: "2026-11-21T20:00:00",
      title: "행사장 정리 및 해산",
      description: "팀별 부스 철거, 스태프 퇴실 점검 후 귀가",
    },
  ],
};
