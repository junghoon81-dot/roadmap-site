import fs from 'fs';
import path from 'path';
import { RoadmapPeriod, RoadmapMeta } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'src/content');

const FILE_MAP: Record<RoadmapPeriod, string> = {
  'may': '5월_로드맵.md',
  'jun': '6월_로드맵.md',
};

const TITLES: Record<RoadmapPeriod, string> = {
  'may': '관계 유지 시스템 + 코칭 리포트',
  'jun': '에이전트 실행 레이어 + 안심결제 전국 도입',
};

const SUBTITLES: Record<RoadmapPeriod, string> = {
  'may': '매주 체크인 · 코칭 리포트 · 중재 · 프로필 구조화',
  'jun': 'Outcome Graph · 에이전트 API · 중재 고도화 · 안심결제 전국 확대',
};

const DESCRIPTIONS: Record<RoadmapPeriod, string> = {
  'may': '매칭 이후 끊기는 관계를 매주 체크인으로 유지하고, 이상 신호 감지 시 코칭 리포트 → 중재 → 재매칭으로 연결. 에이전트 대비 데이터 축적 기반을 확보합니다.',
  'jun': '에이전트 시대 대비 실행 레이어 설계(Outcome Graph, API, 위임 구조), 중재 고도화 + 선생님 대시보드, 안심결제 전국 확대 + 요금 역전 해소',
};

export function getDocContent(period: RoadmapPeriod): string {
  const filename = FILE_MAP[period];
  const filePath = path.join(CONTENT_DIR, period, filename);
  return fs.readFileSync(filePath, 'utf-8');
}

export function getDocMeta(period: RoadmapPeriod): RoadmapMeta {
  const filePath = path.join(CONTENT_DIR, period, FILE_MAP[period]);
  const content = fs.readFileSync(filePath, 'utf-8');
  const versionMatch = content.match(/v(\d+\.\d+[a-z]?)/);
  const version = versionMatch ? versionMatch[0] : 'v0.1';

  const stat = fs.statSync(filePath);
  const mtime = stat.mtime;
  const lastModified = `${mtime.getFullYear()}-${String(mtime.getMonth() + 1).padStart(2, '0')}-${String(mtime.getDate()).padStart(2, '0')}`;

  return {
    period,
    title: TITLES[period],
    subtitle: SUBTITLES[period],
    version,
    lastModified,
    description: DESCRIPTIONS[period],
  };
}
