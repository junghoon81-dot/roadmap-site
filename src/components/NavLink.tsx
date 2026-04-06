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
          ? 'text-emerald-400 font-medium'
          : 'text-zinc-400 hover:text-zinc-100'
      }`}
    >
      {children}
    </Link>
  );
}
