'use client';

import { useState, useRef } from 'react';

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      if (timer.current) clearTimeout(timer.current);
      setCopied(true);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 권한 거부 시 무시 */
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 px-2 py-1 text-xs rounded
        bg-zinc-700 hover:bg-zinc-600 text-zinc-300 hover:text-white
        transition-colors duration-200 opacity-0 group-hover:opacity-100"
      title="복사"
    >
      {copied ? '✓ 복사됨' : '복사'}
    </button>
  );
}
