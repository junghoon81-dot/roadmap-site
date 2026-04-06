import { getDocContent, getDocMeta } from '@/lib/docs';
import RoadmapViewer from '@/components/RoadmapViewer';

export const metadata = { title: '5월 로드맵 — 관계 유지 시스템 + 에이전트 기반 설계 | 김과외 로드맵' };

export default function MayPage() {
  const content = getDocContent('may');
  const meta = getDocMeta('may');

  return <RoadmapViewer period="may" content={content} version={meta.version} title={meta.title} />;
}
