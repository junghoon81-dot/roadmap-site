import { getDocContent, getDocMeta } from '@/lib/docs';
import RoadmapViewer from '@/components/RoadmapViewer';

export const metadata = { title: '6월 전반 — 에이전트 대비 개편 | 김과외 로드맵' };

export default function JunEarlyPage() {
  const content = getDocContent('jun-early');
  const meta = getDocMeta('jun-early');

  return <RoadmapViewer period="jun-early" content={content} version={meta.version} title={meta.title} />;
}
