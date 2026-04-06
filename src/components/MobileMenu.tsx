'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/roadmap/mar', label: '3월 로드맵' },
  { href: '/roadmap/apr', label: '4월 로드맵' },
  { href: '/roadmap/may', label: '5월 로드맵' },
  { href: '/roadmap/jun', label: '6월 로드맵' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-[#1d1d1f]/60 hover:text-[#1d1d1f]"
        aria-label="메뉴 열기"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute top-12 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-black/[0.08] py-2 px-4 shadow-sm">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`block py-2.5 text-sm ${
                pathname === href ? 'text-[#0071e3] font-semibold' : 'text-[#1d1d1f]/60'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
