import fs from 'fs';
import path from 'path';
import { RoadmapPeriod, RoadmapMeta } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'src/content');

const FILE_MAP: Record<RoadmapPeriod, string> = {
  'may-late': '5월후반_관계유지시스템.md',
  'jun-early': '6월전반_에이전트대비개편.md',
  'jun-late': '6월후반_안심결제_요금체계.md',
};

const TITLES: Record<RoadmapPeriod, string> = {
  'may-late': '알림톡 기반 관계 유지 시스템 + 코칭 리포트',
  'jun-early': '에이전트 시대 대비 개편',
  'jun-late': '안심결제 전국 도입 + 요금 체계 개선',
};

const SUBTITLES: Record<RoadmapPeriod, string> = {
  'may-late': '매주 체크인 · 코칭 리포트 · 중재 · 프로필 채우기',
  'jun-early': '추천카드 · 플레이빙 · taxonomy · 에이전트 API 설계',
  'jun-late': '안심결제 전국 확대 · 일반결제 대비 요금 역전 해소',
};

const DESCRIPTIONS: Record<RoadmapPeriod, string> = {
  'may-late': '매칭 이후 끊기는 관계를 매주 체크인으로 유지하고, 이상 신호 감지 시 코칭 리포트 → 중재 → 재매칭으로 연결',
  'jun-early': '선생님 프로필·매칭 결과·학부모 요구사항을 구조화하여 에이전트가 김과외를 신뢰할 수 있는 실행 레이어 구축',
  'jun-late': '안심결제를 전국으로 확대하고, 안심결제 이용요금이 일반결제보다 낮은 구조적 문제를 해결',
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
