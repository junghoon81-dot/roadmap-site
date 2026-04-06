import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import NavLink from '@/components/NavLink';
import MobileMenu from '@/components/MobileMenu';
import './globals.css';

export const metadata: Metadata = {
  title: '김과외 프로덕트 로드맵',
  description: '김과외 3월–6월 프로덕트 로드맵 — 공고 개편 · AI 검색 · 매출 향상 · 관계 유지 · 판단 보조',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-[#f5f5f7] text-[#1d1d1f] min-h-screen antialiased">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl backdrop-saturate-[180%] border-b border-black/[0.08]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
            <Link href="/" className="text-base font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors shrink-0 tracking-tight">
              김과외 로드맵
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex gap-5 lg:gap-7 text-sm ml-8">
              <NavLink href="/roadmap/mar">3월</NavLink>
              <NavLink href="/roadmap/apr">4월</NavLink>
              <NavLink href="/roadmap/may">5월</NavLink>
              <NavLink href="/roadmap/jun">6월</NavLink>
              <NavLink href="/archive">아카이브</NavLink>
            </nav>

            {/* Mobile hamburger */}
            <MobileMenu />
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
