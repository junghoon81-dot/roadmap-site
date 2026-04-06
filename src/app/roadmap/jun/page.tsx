import { getDocContent, getDocMeta } from '@/lib/docs';
import RoadmapViewer from '@/components/RoadmapViewer';

export const metadata = { title: '6월 로드맵 — 에이전트 실행 레이어 + 안심결제 | 김과외 로드맵' };

export default function JunPage() {
  const content = getDocContent('jun');
  const meta = getDocMeta('jun');

  return <RoadmapViewer period="jun" content={content} version={meta.version} title={meta.title} />;
}
