import { getDocContent, getDocMeta } from '@/lib/docs';
import RoadmapViewer from '@/components/RoadmapViewer';

export const metadata = {
  title: '4월 로드맵 — 매출 향상 포인트 + SEO 랜딩 + 선생님 편의성 | 김과외 로드맵',
};

export default function AprPage() {
  const content = getDocContent('apr');
  const meta = getDocMeta('apr');

  return (
    <RoadmapViewer
      period="apr"
      content={content}
      version={meta.version}
      title={meta.title}
    />
  );
}
