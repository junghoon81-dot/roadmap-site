import { getDocContent, getDocMeta } from '@/lib/docs';
import RoadmapViewer from '@/components/RoadmapViewer';

export const metadata = { title: '6월 후반 — 안심결제 + 요금 체계 | 김과외 로드맵' };

export default function JunLatePage() {
  const content = getDocContent('jun-late');
  const meta = getDocMeta('jun-late');

  return <RoadmapViewer period="jun-late" content={content} version={meta.version} title={meta.title} />;
}
