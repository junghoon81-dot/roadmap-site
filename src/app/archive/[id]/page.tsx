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

  // Find correction docs (이 문서를 교정한 문서)
  const correctedBy = (meta.corrected_by_ids || [])
    .map((cid: string) => index.find((e) => e.id === cid))
    .filter(Boolean);

  // Find docs this document corrects
  const corrects = (meta.corrects_ids || [])
    .map((cid: string) => index.find((e) => e.id === cid))
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

        {/* Authority / Intent badge */}
        {(meta.default_authority || meta.document_intent) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {meta.document_intent && (
              <span className={`text-[11px] px-2 py-1 rounded-lg font-medium ${
                meta.document_intent === 'fact-registry' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                meta.document_intent === 'proposal' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                meta.document_intent === 'session-record' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                'bg-gray-50 text-gray-600 border border-gray-200'
              }`}>
                {meta.document_intent === 'proposal' ? '제안/가설' :
                 meta.document_intent === 'analysis' ? '분석' :
                 meta.document_intent === 'session-record' ? '세션 기록' :
                 meta.document_intent === 'fact-registry' ? '확인된 사실' :
                 meta.document_intent}
              </span>
            )}
            {meta.default_authority && (
              <span className={`text-[11px] px-2 py-1 rounded-lg font-medium ${
                meta.default_authority === 'owner-confirmed' ? 'bg-green-50 text-green-700 border border-green-200' :
                meta.default_authority === 'proposed' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                meta.default_authority === 'evidence-backed' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                'bg-gray-50 text-gray-600 border border-gray-200'
              }`}>
                {meta.default_authority === 'owner-confirmed' ? '대표님 확인' :
                 meta.default_authority === 'proposed' ? '미확인 제안' :
                 meta.default_authority === 'evidence-backed' ? '데이터 근거' :
                 meta.default_authority === 'mixed' ? '혼합 (사실+제안)' :
                 meta.default_authority}
              </span>
            )}
          </div>
        )}

        {/* Correction warning banner — 이 문서가 다른 문서에 의해 교정됨 */}
        {correctedBy.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            <span className="text-[11px] text-red-700 font-semibold">⚠️ 이 문서의 일부 내용이 교정되었습니다:</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {correctedBy.map((c) => c && (
                <Link
                  key={c.id}
                  href={`/archive/${c.id}`}
                  className="text-[11px] px-2 py-1 bg-white rounded-lg text-red-600 hover:text-red-800 transition-colors shadow-sm border border-red-100"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* This document corrects others */}
        {corrects.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
            <span className="text-[11px] text-green-700 font-semibold">🔧 이 문서는 다음 문서를 교정합니다:</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {corrects.map((c) => c && (
                <Link
                  key={c.id}
                  href={`/archive/${c.id}`}
                  className="text-[11px] px-2 py-1 bg-white rounded-lg text-green-600 hover:text-green-800 transition-colors shadow-sm border border-green-100"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          </div>
        )}

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
