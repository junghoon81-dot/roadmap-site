'use client';

import { useState, useCallback, useRef } from 'react';
import { RoadmapPeriod, PERIOD_LABELS, PERIOD_DATES } from '@/lib/types';
import MarkdownRenderer from './MarkdownRenderer';
import TableOfContents from './TableOfContents';

interface Props {
  period: RoadmapPeriod;
  content: string;
  version: string;
  title: string;
}

export default function RoadmapViewer({ period, content, version, title }: Props) {
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, []);

  const handleDownload = () => {
    const filename = `김과외_${PERIOD_LABELS[period]}_로드맵_${new Date().toISOString().slice(0, 10)}.md`;
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
      <div className="sticky top-14 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800
        py-2 sm:py-3 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <span className="text-sm sm:text-base font-semibold text-emerald-400 truncate">
                {PERIOD_LABELS[period]}
              </span>
              <span className="hidden sm:inline text-xs text-zinc-500">
                {PERIOD_DATES[period]}
              </span>
              <span className="text-xs font-mono px-2 py-1 bg-emerald-600/20 text-emerald-400 rounded whitespace-nowrap">
                {version}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button onClick={handleCopyAll}
                className="px-2 sm:px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md transition-colors whitespace-nowrap">
                <span className="sm:hidden">📋</span>
                <span className="hidden sm:inline">📋 복사</span>
              </button>
              <button onClick={handleDownload}
                className="px-2 sm:px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md transition-colors whitespace-nowrap">
                <span className="sm:hidden">⬇</span>
                <span className="hidden sm:inline">⬇ .md</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content + TOC */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 flex gap-8">
        <article className="flex-1 min-w-0">
          <MarkdownRenderer content={content} />
        </article>
        <TableOfContents content={content} />
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
          px-4 py-2.5 bg-emerald-600 text-white text-sm rounded-lg shadow-lg
          animate-[fadeInUp_0.2s_ease-out] max-w-[90vw] text-center">
          {toast}
        </div>
      )}
    </div>
  );
}
