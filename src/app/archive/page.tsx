import fs from 'fs';
import path from 'path';
import ArchiveViewer from '@/components/ArchiveViewer';

export const metadata = {
  title: '작업 아카이브 — 전체 기록 | 김과외 로드맵',
};

export default function ArchivePage() {
  const filePath = path.join(process.cwd(), 'src/content/archive/작업_아카이브.md');
  const content = fs.readFileSync(filePath, 'utf-8');

  return <ArchiveViewer content={content} />;
}
