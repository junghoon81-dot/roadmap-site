export type RoadmapPeriod = 'may-late' | 'jun-early' | 'jun-late';

export interface RoadmapMeta {
  period: RoadmapPeriod;
  title: string;
  subtitle: string;
  version: string;
  lastModified: string;
  description: string;
}

export const PERIOD_LABELS: Record<RoadmapPeriod, string> = {
  'may-late': '5월 후반',
  'jun-early': '6월 전반',
  'jun-late': '6월 후반',
};

export const PERIOD_DATES: Record<RoadmapPeriod, string> = {
  'may-late': '5/3주차 ~ 5/4주차',
  'jun-early': '6/1주차 ~ 6/2주차',
  'jun-late': '6/3주차 ~ 6/4주차',
};
