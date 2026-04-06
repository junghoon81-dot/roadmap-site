'use client';

import { useState, useEffect } from 'react';
import { generateHeadingId, normalizeHeadingText } from '@/lib/heading-id';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState('');
  const [items, setItems] = useState<TocItem[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const headings = content.match(/^#{1,3}\s+.+$/gm) || [];
    const usedIds = new Set<string>();
    const tocItems = headings.map((h) => {
      const level = h.match(/^#+/)![0].length;
      const text = normalizeHeadingText(h.replace(/^#+\s+/, ''));
      const id = generateHeadingId(text, usedIds);
      return { id, text, level };
    });
    setItems(tocItems);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  // 모바일 목차 열릴 때 스크롤 잠금
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  if (items.length === 0) return null;

  const handleClick = (id: string) => {
    setMobileOpen(false);
    // 약간의 딜레이 후 스크롤 (body overflow 복원 대기)
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      {/* 데스크톱 사이드 TOC */}
      <nav className="hidden xl:block w-56 shrink-0 sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto
        text-sm pl-6">
        <p className="text-[#1d1d1f]/30 font-medium mb-3 text-[10px] uppercase tracking-widest">목차</p>
        <ul className="space-y-0.5">
          {items.map(({ id, text, level }) => (
            <li key={id} style={{ paddingLeft: `${(level - 1) * 12}px` }}>
              <a
                href={`#${id}`}
                className={`block py-0.5 truncate transition-colors duration-150 text-[13px] ${
                  activeId === id
                    ? 'text-[#0071e3] font-medium'
                    : 'text-[#1d1d1f]/40 hover:text-[#1d1d1f]/70'
                }`}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 모바일 플로팅 TOC 버튼 */}
      <button
        onClick={() => setMobileOpen(true)}
        className="xl:hidden fixed bottom-5 right-4 z-40 w-12 h-12
          bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#006edb]
          text-white rounded-full shadow-lg shadow-[#0071e3]/20
          flex items-center justify-center transition-colors"
        aria-label="목차 열기"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 6h16M4 12h12M4 18h8" />
        </svg>
      </button>

      {/* 모바일 TOC 바텀시트 */}
      {mobileOpen && (
        <div className="xl:hidden fixed inset-0 z-50">
          {/* 오버레이 */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* 바텀시트 */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl
            rounded-t-2xl max-h-[70vh] overflow-y-auto
            animate-[slideUp_0.25s_ease-out] shadow-2xl">
            {/* 핸들 바 */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-xl pt-3 pb-2 px-4 border-b border-black/[0.06]">
              <div className="w-10 h-1 bg-[#1d1d1f]/10 rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#1d1d1f]">목차</p>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-[#1d1d1f]/40 hover:text-[#1d1d1f] p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            {/* 목차 리스트 */}
            <ul className="px-4 py-3 space-y-0.5">
              {items.map(({ id, text, level }) => (
                <li key={id} style={{ paddingLeft: `${(level - 1) * 16}px` }}>
                  <button
                    onClick={() => handleClick(id)}
                    className={`block w-full text-left py-2 px-2 rounded-xl text-sm transition-colors
                      ${activeId === id
                        ? 'text-[#0071e3] font-medium bg-[#0071e3]/[0.06]'
                        : 'text-[#1d1d1f]/50 hover:text-[#1d1d1f] hover:bg-[#f5f5f7] active:bg-[#e8e8ed]'
                      }`}
                  >
                    {text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
