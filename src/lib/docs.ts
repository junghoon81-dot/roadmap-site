import fs from 'fs';
import path from 'path';
import { RoadmapPeriod, RoadmapMeta } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'src/content');

const FILE_MAP: Record<RoadmapPeriod, string> = {
  'mar': '3월_로드맵.md',
  'apr': '4월_로드맵.md',
  'may': '5월_로드맵.md',
  'jun': '6월_로드맵.md',
};

const TITLES: Record<RoadmapPeriod, string> = {
  'mar': '공고 개편 + AI 자연어 검색 + 수업료 납부',
  'apr': '매출 향상 포인트 + SEO 랜딩 + 선생님 편의성',
  'may': '관계 유지 시스템 + 코칭 리포트',
  'jun': 'AI 즉시 매칭 추천 + 이상 징후 감지 + SEO 랜딩',
};

const SUBTITLES: Record<RoadmapPeriod, string> = {
  'mar': '경쟁강도 · 소개서 구조화 · AI 자연어 검색 · 수업료 납부 자동화 · 학원법 대응',
  'apr': '성사 누락 잡기 · 시범→정규 전환 · SEO 10만 페이지 · 안 읽은 공고 · 수업일정 알리미',
  'may': '매주 체크인 · 코칭 리포트 · 중재 · 프로필 구조화',
  'jun': 'AI 즉시 매칭 · 이상 징후 감지 · SEO 10만 페이지 · 지역 기반 추천',
};

const DESCRIPTIONS: Record<RoadmapPeriod, string> = {
  'mar': '공고에 경쟁강도 도입, 소개서 신규 항목(수업 요일/시간대·수업 목적·자신있는 파트), AI 자연어 검색(조건 문장 → 적합 선생님 추천), 수업료 납부 요청서 자동발송, 현금영수증 자동발급, 학원법 개정 대응. 4/13 배포 예정.',
  'apr': '현욱님 기획 3개 파트. 매출 향상 포인트 8개(성사 누락·시범전환·FOMO·리뷰·이탈복구·부스트·휴면·설문), SEO 프로그래매틱 랜딩 10만 페이지, 선생님 편의성 강화.',
  'may': '온플랫폼 관계 지속 특집. 매칭 이후 끊기는 관계를 매주 체크인으로 유지하고, 이상 신호 감지 시 코칭 리포트 → 중재 → 재매칭으로 연결합니다.',
  'jun': '판단 보조 시스템 완성. 공고 등록 즉시 AI 매칭 추천(추천 이유 카드), 이상 징후 감지 v1(미연락·결제지연·저만족도), SEO 프로그래매틱 랜딩 10만+ 페이지, 지역 기반 추천 고도화.',
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
