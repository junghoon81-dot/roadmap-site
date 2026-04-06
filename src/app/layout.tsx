import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import NavLink from '@/components/NavLink';
import MobileMenu from '@/components/MobileMenu';
import './globals.css';

export const metadata: Metadata = {
  title: '김과외 프로덕트 로드맵',
  description: '김과외 5월~6월 패치 기획 로드맵 — 관계 유지 · 에이전트 대비 · 안심결제',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">
        <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold text-emerald-400 hover:text-emerald-300 transition-colors shrink-0">
              김과외 로드맵
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex gap-4 lg:gap-6 text-sm ml-8">
              <NavLink href="/roadmap/may-late">5월 후반</NavLink>
              <NavLink href="/roadmap/jun-early">6월 전반</NavLink>
              <NavLink href="/roadmap/jun-late">6월 후반</NavLink>
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
