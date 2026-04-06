export type RoadmapPeriod = 'may' | 'jun';

export interface RoadmapMeta {
  period: RoadmapPeriod;
  title: string;
  subtitle: string;
  version: string;
  lastModified: string;
  description: string;
}

export const PERIOD_LABELS: Record<RoadmapPeriod, string> = {
  'may': '5월 로드맵',
  'jun': '6월 로드맵',
};

export const PERIOD_DATES: Record<RoadmapPeriod, string> = {
  'may': '5월',
  'jun': '6월',
};
