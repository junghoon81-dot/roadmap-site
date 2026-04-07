import Link from 'next/link';
import { getArchiveIndex, getTypeLabel, getTypeColor } from '@/lib/archive';

export const metadata = {
  title: '전략 아카이브 | 김과외 로드맵',
};

export default function ArchivePage() {
  const entries = getArchiveIndex();

  // Group by type
  const types = Array.from(new Set(entries.map((e) => e.type)));
  const typeOrder = ['data-analysis', 'codex-review', 'codex-prompt', 'roadmap', 'audit', 'sop'];
  types.sort((a, b) => {
    const ai = typeOrder.indexOf(a);
    const bi = typeOrder.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <div>
      {/* Header */}
      <div className="sticky top-12 z-40 bg-white/80 backdrop-blur-xl backdrop-saturate-[180%] border-b border-black/[0.06] py-2.5 px-3 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold text-[#1d1d1f] tracking-tight">전략 아카이브</span>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-[#ff9500]/10 text-[#ff9500] rounded-full">
              {entries.length}개 문서
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#1d1d1f]/40">
            <span>{types.length}개 유형</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {types.map((type) => {
            const count = entries.filter((e) => e.type === type).length;
            return (
              <div key={type} className="bg-white rounded-xl p-3 shadow-sm border border-black/[0.04]">
                <div className="text-2xl font-semibold text-[#1d1d1f]">{count}</div>
                <div className="text-xs text-[#1d1d1f]/50 mt-0.5">{getTypeLabel(type)}</div>
              </div>
            );
          })}
        </div>

        {/* Document list by type */}
        {types.map((type) => {
          const docs = entries.filter((e) => e.type === type);
          return (
            <section key={type} className="mb-8">
              <h2 className="text-sm font-semibold text-[#1d1d1f]/70 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${getTypeColor(type)}`}>
                  {getTypeLabel(type)}
                </span>
                <span className="text-[#1d1d1f]/30">{docs.length}개</span>
              </h2>
              <div className="space-y-2">
                {docs.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/archive/${doc.id}`}
                    className="block bg-white rounded-xl p-4 shadow-sm border border-black/[0.04] hover:border-black/[0.1] hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-[#1d1d1f]/40 font-mono">{doc.date}</span>
                          {doc.version && doc.version !== 'v1' && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-[#f5f5f7] text-[#1d1d1f]/50 rounded">
                              {doc.version}
                            </span>
                          )}
                          {!doc.canonical && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-yellow-50 text-yellow-600 rounded">
                              비정규
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-medium text-[#1d1d1f] group-hover:text-blue-600 transition-colors leading-snug">
                          {doc.title}
                        </h3>
                        <p className="text-xs text-[#1d1d1f]/50 mt-1 line-clamp-2 leading-relaxed">
                          {doc.summary_line}
                        </p>
                        {doc.key_findings && doc.key_findings.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {doc.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-[#f5f5f7] text-[#1d1d1f]/40 rounded">
                                {tag.replace(/^(topic|metric|method|period|artifact)\//, '')}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 text-[#1d1d1f]/20 group-hover:text-[#1d1d1f]/40 transition-colors">
                        →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* Legacy link */}
        <div className="mt-12 pt-6 border-t border-black/[0.06]">
          <p className="text-xs text-[#1d1d1f]/30">
            이전 단일 아카이브(2026-04-07 flat snapshot)는{' '}
            <Link href="/archive/legacy" className="underline hover:text-[#1d1d1f]/50">
              레거시 아카이브
            </Link>
            에서 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
