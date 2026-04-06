export type RoadmapPeriod = 'mar' | 'apr' | 'may' | 'jun';

export interface RoadmapMeta {
  period: RoadmapPeriod;
  title: string;
  subtitle: string;
  version: string;
  lastModified: string;
  description: string;
}

export const PERIOD_LABELS: Record<RoadmapPeriod, string> = {
  'mar': '3월 로드맵',
  'apr': '4월 로드맵',
  'may': '5월 로드맵',
  'jun': '6월 로드맵',
};

export const PERIOD_DATES: Record<RoadmapPeriod, string> = {
  'mar': '3월',
  'apr': '4월',
  'may': '5월',
  'jun': '6월',
};
