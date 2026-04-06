import Link from 'next/link';
import { getDocMeta } from '@/lib/docs';
import { RoadmapPeriod, PERIOD_DATES } from '@/lib/types';

const cards: { period: RoadmapPeriod; href: string; icon: string; status: string; statusColor: string }[] = [
  {
    period: 'may-late',
    href: '/roadmap/may-late',
    icon: '🔔',
    status: '핵심',
    statusColor: 'bg-red-500/20 text-red-400',
  },
  {
    period: 'jun-early',
    href: '/roadmap/jun-early',
    icon: '🤖',
    status: '준비',
    statusColor: 'bg-amber-500/20 text-amber-400',
  },
  {
    period: 'jun-late',
    href: '/roadmap/jun-late',
    icon: '💳',
    status: '준비',
    statusColor: 'bg-blue-500/20 text-blue-400',
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
      {/* Hero */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
          김과외 <span className="text-emerald-400">프로덕트 로드맵</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          5월 패치 ~ 6월 개편 기획 문서. 2주 단위로 분리하여 관리합니다.
        </p>
      </div>

      {/* Timeline indicator */}
      <div className="mb-8 sm:mb-10 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 sm:p-6">
        <h2 className="text-sm font-semibold text-zinc-300 mb-3">전체 일정</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          {cards.map(({ period, statusColor, status }, i) => {
            const meta = getDocMeta(period);
            return (
              <div key={period} className="flex-1 flex items-center gap-2 sm:gap-0">
                <div className="flex-1 bg-zinc-800/60 rounded-lg px-3 py-2.5 sm:rounded-none sm:first:rounded-l-lg sm:last:rounded-r-lg border border-zinc-700/50 sm:border-r-0 sm:last:border-r">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-emerald-400">{PERIOD_DATES[period]}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusColor}`}>{status}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">{meta.title}</p>
                </div>
                {i < cards.length - 1 && (
                  <span className="hidden sm:block text-zinc-600 px-1">→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-3 sm:gap-5 md:grid-cols-3">
        {cards.map(({ period, href, icon, status, statusColor }) => {
          const meta = getDocMeta(period);
          return (
            <Link key={period} href={href}
              className="group block p-4 sm:p-6 bg-zinc-900 border border-zinc-800 rounded-xl
                hover:border-emerald-600/50 hover:bg-zinc-900/80 transition-all duration-200
                active:scale-[0.98]">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <span className="text-xl sm:text-2xl">{icon}</span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusColor}`}>{status}</span>
                  <span className="text-[10px] sm:text-xs font-mono px-1.5 sm:px-2 py-0.5 bg-emerald-600/20 text-emerald-400 rounded">
                    {meta.version}
                  </span>
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-500 mb-1.5">{PERIOD_DATES[period]}</p>
              <h2 className="text-base sm:text-lg font-semibold mb-1 sm:mb-1.5 group-hover:text-emerald-400 transition-colors leading-snug">
                {meta.title}
              </h2>
              <p className="text-xs text-zinc-500 mb-2 sm:mb-3 leading-relaxed">{meta.subtitle}</p>
              <p className="text-xs text-zinc-400 bg-zinc-800/60 rounded-md px-2.5 sm:px-3 py-1.5 sm:py-2 leading-relaxed line-clamp-3">
                {meta.description}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-10 sm:mt-12 text-center text-[10px] sm:text-xs text-zinc-600 leading-relaxed">
        문서를 클릭하면 해당 기간의 상세 기획을 볼 수 있습니다. 📋 복사 / ⬇ 다운로드 가능.
      </div>
    </div>
  );
}
