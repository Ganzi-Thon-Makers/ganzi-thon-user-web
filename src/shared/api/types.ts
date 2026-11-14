/** 서버 BaseEntity 공통 필드. 날짜는 서버 LocalDateTime(타임존 없는 ISO 문자열) 그대로 받는다. */
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}
