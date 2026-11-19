export interface Timeline {
  id: number;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
}

export interface TimetableResponse {
  timetables: Timeline[];
}
