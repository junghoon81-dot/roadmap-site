import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import ArchiveViewer from '@/components/ArchiveViewer';

export const metadata = {
  title: '레거시 아카이브 | 김과외 로드맵',
};

export default function LegacyArchivePage() {
  const filePath = path.join(
    process.cwd(),
    'src/content/archive/legacy/2026/2026-04-07-flat-archive.md'
  );
  const content = fs.readFileSync(filePath, 'utf-8');

  return (
    <div>
      <div className="sticky top-12 z-40 bg-white/80 backdrop-blur-xl backdrop-saturate-[180%] border-b border-black/[0.06] py-2.5 px-3 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/archive" className="text-xs text-[#1d1d1f]/40 hover:text-[#1d1d1f]/60 transition-colors">
              ← 목록
            </Link>
            <span className="text-sm font-semibold text-[#1d1d1f] tracking-tight">
              레거시 아카이브
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
              2026-04-07 snapshot
            </span>
          </div>
        </div>
      </div>
      <ArchiveViewer content={content} />
    </div>
  );
}
