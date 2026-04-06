import { getDocContent, getDocMeta } from '@/lib/docs';
import RoadmapViewer from '@/components/RoadmapViewer';

export const metadata = { title: '5월 후반 — 관계 유지 시스템 | 김과외 로드맵' };

export default function MayLatePage() {
  const content = getDocContent('may-late');
  const meta = getDocMeta('may-late');

  return <RoadmapViewer period="may-late" content={content} version={meta.version} title={meta.title} />;
}
