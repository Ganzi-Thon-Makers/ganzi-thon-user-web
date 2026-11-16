export interface TimelineEvent {
  id: number;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
}

export interface TimelineResponse {
  data: TimelineEvent[];
}
