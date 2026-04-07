import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArchiveIndex, getArchiveDoc, getTypeLabel, getTypeColor } from '@/lib/archive';
import ArchiveViewer from '@/components/ArchiveViewer';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const index = getArchiveIndex();
  return index.map((entry) => ({ id: entry.id }));
}

export async function generateMetadata(props: Props) {
  const { id } = await props.params;
  const doc = getArchiveDoc(id);
  if (!doc) return { title: '문서를 찾을 수 없습니다' };
  return {
    title: `${doc.meta.title} | 전략 아카이브`,
  };
}

export default async function ArchiveDocPage(props: Props) {
  const { id } = await props.params;
  const doc = getArchiveDoc(id);
  if (!doc) notFound();

  const { meta, content } = doc;

  // Find related docs
  const index = getArchiveIndex();
  const related = meta.related_ids
    .map((rid) => index.find((e) => e.id === rid))
    .filter(Boolean);

  return (
    <div>
      {/* Header */}
      <div className="sticky top-12 z-40 bg-white/80 backdrop-blur-xl backdrop-saturate-[180%] border-b border-black/[0.06] py-2.5 px-3 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/archive" className="text-xs text-[#1d1d1f]/40 hover:text-[#1d1d1f]/60 transition-colors shrink-0">
              ← 목록
            </Link>
            <span className="text-sm font-semibold text-[#1d1d1f] truncate tracking-tight">
              {meta.title}
            </span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${getTypeColor(meta.type)}`}>
              {getTypeLabel(meta.type)}
            </span>
          </div>
        </div>
      </div>

      {/* Meta info */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 pt-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-black/[0.04] mb-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#1d1d1f]/50">
            <span>날짜: <strong className="text-[#1d1d1f]/70">{meta.date}</strong></span>
            <span>버전: <strong className="text-[#1d1d1f]/70">{meta.version}</strong></span>
            <span>상태: <strong className="text-[#1d1d1f]/70">{meta.canonical ? '정규 (canonical)' : '비정규'}</strong></span>
            <span>크기: <strong className="text-[#1d1d1f]/70">{meta.token_hint}</strong></span>
          </div>
          {meta.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {meta.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-[#f5f5f7] text-[#1d1d1f]/40 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Related docs */}
        {related.length > 0 && (
          <div className="bg-[#f5f5f7] rounded-xl p-3 mb-4">
            <span className="text-[11px] text-[#1d1d1f]/40 font-medium">관련 문서:</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {related.map((r) => r && (
                <Link
                  key={r.id}
                  href={`/archive/${r.id}`}
                  className="text-[11px] px-2 py-1 bg-white rounded-lg text-[#1d1d1f]/60 hover:text-blue-600 transition-colors shadow-sm"
                >
                  {r.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <ArchiveViewer
        content={content}
        title={meta.title}
        subtitle={`${meta.date} · ${meta.version}`}
        downloadName={`${meta.id}.md`}
      />
    </div>
  );
}
