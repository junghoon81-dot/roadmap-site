'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`transition-colors ${
        isActive
          ? 'text-[#0071e3] font-medium'
          : 'text-[#1d1d1f]/60 hover:text-[#1d1d1f]'
      }`}
    >
      {children}
    </Link>
  );
}
