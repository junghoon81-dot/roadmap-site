import { getDocContent, getDocMeta } from '@/lib/docs';
import RoadmapViewer from '@/components/RoadmapViewer';

export const metadata = { title: '6월 로드맵 — 안심결제 + 요금 체계 | 김과외 로드맵' };

export default function JunPage() {
  const content = getDocContent('jun');
  const meta = getDocMeta('jun');

  return <RoadmapViewer period="jun" content={content} version={meta.version} title={meta.title} />;
}
