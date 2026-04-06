'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CopyButton from './CopyButton';
import { generateHeadingId, normalizeHeadingText } from '@/lib/heading-id';

interface Props {
  content: string;
}

export default function MarkdownRenderer({ content }: Props) {
  // 마크다운 원문에서 heading 순서대로 ID를 미리 계산 (TOC와 동일 순서 보장)
  const headingIdMap = useMemo(() => {
    const headings = content.match(/^#{1,3}\s+.+$/gm) || [];
    const usedIds = new Set<string>();
    const map: string[] = [];
    headings.forEach((h) => {
      const text = normalizeHeadingText(h.replace(/^#+\s+/, ''));
      map.push(generateHeadingId(text, usedIds));
    });
    return map;
  }, [content]);

  let headingIndex = 0;

  const getNextHeadingId = () => {
    const id = headingIdMap[headingIndex] || `heading-${headingIndex}`;
    headingIndex++;
    return id;
  };

  return (
    <div className="prose prose-zinc max-w-none
      prose-headings:scroll-mt-28 prose-headings:tracking-tight
      prose-h1:text-xl prose-h1:sm:text-2xl prose-h1:font-semibold prose-h1:border-b prose-h1:border-black/[0.08] prose-h1:pb-3
      prose-h2:text-lg prose-h2:sm:text-xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:sm:mt-10 prose-h2:border-b prose-h2:border-black/[0.06] prose-h2:pb-2
      prose-h3:text-base prose-h3:sm:text-lg prose-h3:font-medium prose-h3:mt-6 prose-h3:sm:mt-8
      prose-p:text-sm prose-p:sm:text-base prose-p:leading-relaxed prose-p:text-[#1d1d1f]/80
      prose-li:text-sm prose-li:sm:text-base prose-li:text-[#1d1d1f]/80
      prose-table:text-xs prose-table:sm:text-sm
      prose-th:bg-[#f5f5f7] prose-th:px-2 prose-th:sm:px-3 prose-th:py-1.5 prose-th:sm:py-2 prose-th:text-xs prose-th:sm:text-sm prose-th:text-[#1d1d1f]/70 prose-th:font-semibold
      prose-td:px-2 prose-td:sm:px-3 prose-td:py-1.5 prose-td:sm:py-2 prose-td:border-black/[0.06] prose-td:text-xs prose-td:sm:text-sm
      prose-code:text-[#0071e3] prose-code:bg-[#f5f5f7]
      prose-code:px-1 prose-code:sm:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-code:sm:text-sm
      prose-pre:bg-[#1d1d1f] prose-pre:border-0 prose-pre:rounded-xl
      prose-pre:text-xs prose-pre:sm:text-sm
      prose-strong:text-[#1d1d1f]
      prose-a:text-[#0066cc] prose-a:no-underline hover:prose-a:underline
      prose-li:marker:text-[#1d1d1f]/30
      prose-blockquote:border-l-[#0071e3] prose-blockquote:bg-[#f5f5f7] prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:px-3 prose-blockquote:sm:px-4
      prose-blockquote:text-sm prose-blockquote:text-[#1d1d1f]/70
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children, ...props }) {
            let codeText = '';
            try {
              const el = children as React.ReactElement<{ children?: React.ReactNode }>;
              if (el?.props?.children) {
                codeText = String(el.props.children).replace(/\n$/, '');
              }
            } catch { /* ignore */ }
            return (
              <div className="relative group -mx-3 sm:mx-0">
                <CopyButton text={codeText} />
                <pre className="overflow-x-auto !rounded-none sm:!rounded-lg" {...props}>{children}</pre>
              </div>
            );
          },
          table({ children, ...props }) {
            return (
              <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
                <table className="min-w-full" {...props}>{children}</table>
              </div>
            );
          },
          h1({ children, ...props }) {
            return <h1 id={getNextHeadingId()} {...props}>{children}</h1>;
          },
          h2({ children, ...props }) {
            return <h2 id={getNextHeadingId()} {...props}>{children}</h2>;
          },
          h3({ children, ...props }) {
            return <h3 id={getNextHeadingId()} {...props}>{children}</h3>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
