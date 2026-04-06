import { getDocContent, getDocMeta } from '@/lib/docs';
import RoadmapViewer from '@/components/RoadmapViewer';

export const metadata = {
  title: '3월 로드맵 — 공고 개편 + AI 자연어 검색 + 수업료 납부 | 김과외 로드맵',
};

export default function MarPage() {
  const content = getDocContent('mar');
  const meta = getDocMeta('mar');

  return (
    <RoadmapViewer
      period="mar"
      content={content}
      version={meta.version}
      title={meta.title}
    />
  );
}
