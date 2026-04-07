'use client';

import { useState, useCallback, useRef } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import TableOfContents from './TableOfContents';

interface Props {
  content: string;
  title?: string;
  subtitle?: string;
  downloadName?: string;
}

export default function ArchiveViewer({ content, title, subtitle, downloadName }: Props) {
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, []);

  const handleDownload = () => {
    const filename = downloadName || `김과외_작업아카이브_${new Date().toISOString().slice(0, 10)}.md`;
    const blob = new Blob([content], { type: 'text/markdown; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(content);
      showToast('전체 문서가 클립보드에 복사되었습니다');
    } catch {
      showToast('복사에 실패했습니다.');
    }
  };

  return (
    <div>
      {/* Header bar */}
      <div className="sticky top-12 z-40 bg-white/80 backdrop-blur-xl backdrop-saturate-[180%] border-b border-black/[0.06]
        py-2 sm:py-2.5 px-3 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <span className="text-sm sm:text-base font-semibold text-[#1d1d1f] truncate tracking-tight">
                {title || '작업 아카이브'}
              </span>
              {(subtitle || !title) && (
                <span className="hidden sm:inline text-xs text-[#1d1d1f]/40">
                  {subtitle || '2026-04-07 전체 기록'}
                </span>
              )}
              <span className="text-[11px] font-mono px-2 py-0.5 bg-[#ff9500]/10 text-[#ff9500] rounded-full whitespace-nowrap">
                아카이브
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button onClick={handleCopyAll}
                className="px-2.5 sm:px-3 py-1.5 text-xs bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f]/70 rounded-lg transition-colors whitespace-nowrap">
                <span className="sm:hidden">📋</span>
                <span className="hidden sm:inline">📋 복사</span>
              </button>
              <button onClick={handleDownload}
                className="px-2.5 sm:px-3 py-1.5 text-xs bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f]/70 rounded-lg transition-colors whitespace-nowrap">
                <span className="sm:hidden">⬇</span>
                <span className="hidden sm:inline">⬇ .md</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content + TOC */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-10 flex gap-8">
        <article className="flex-1 min-w-0 bg-white rounded-2xl p-5 sm:p-8 shadow-sm">
          <MarkdownRenderer content={content} />
        </article>
        <TableOfContents content={content} />
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
          px-5 py-2.5 bg-[#1d1d1f] text-white text-sm rounded-full shadow-lg
          animate-[fadeInUp_0.2s_ease-out] max-w-[90vw] text-center">
          {toast}
        </div>
      )}
    </div>
  );
}
