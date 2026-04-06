import Link from 'next/link';
import { getDocMeta } from '@/lib/docs';
import { RoadmapPeriod, PERIOD_DATES } from '@/lib/types';

const cards: { period: RoadmapPeriod; href: string; icon: string; status: string; statusColor: string }[] = [
  {
    period: 'mar',
    href: '/roadmap/mar',
    icon: '📋',
    status: '진행',
    statusColor: 'bg-[#ff9500]/10 text-[#ff9500]',
  },
  {
    period: 'apr',
    href: '/roadmap/apr',
    icon: '📈',
    status: '진행',
    statusColor: 'bg-[#ff9500]/10 text-[#ff9500]',
  },
  {
    period: 'may',
    href: '/roadmap/may',
    icon: '🔔',
    status: '핵심',
    statusColor: 'bg-[#ff3b30]/10 text-[#ff3b30]',
  },
  {
    period: 'jun',
    href: '/roadmap/jun',
    icon: '🤖',
    status: '준비',
    statusColor: 'bg-[#0071e3]/10 text-[#0071e3]',
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      {/* Hero */}
      <div className="text-center mb-10 sm:mb-14">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.08] mb-3">
          김과외 <span className="text-[#0071e3]">프로덕트 로드맵</span>
        </h1>
        <p className="text-[#1d1d1f]/60 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          3월~6월 기획 문서. 월 단위로 분리하여 관리합니다.
        </p>
      </div>

      {/* Timeline */}
      <div className="mb-10 sm:mb-14 bg-white rounded-2xl p-5 sm:p-7 shadow-sm">
        <h2 className="text-xs font-semibold text-[#1d1d1f]/40 uppercase tracking-widest mb-4">전체 일정</h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
          {cards.map(({ period, statusColor, status }, i) => {
            const meta = getDocMeta(period);
            return (
              <div key={period} className="flex-1 flex items-center gap-2 sm:gap-0">
                <div className="flex-1 bg-[#f5f5f7] rounded-xl px-4 py-3 sm:rounded-none sm:first:rounded-l-xl sm:last:rounded-r-xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-[#0071e3]">{PERIOD_DATES[period]}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColor}`}>{status}</span>
                  </div>
                  <p className="text-[13px] text-[#1d1d1f]/70 leading-snug">{meta.title}</p>
                </div>
                {i < cards.length - 1 && (
                  <span className="hidden sm:block text-[#1d1d1f]/20 px-2 text-lg">→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ period, href, icon, status, statusColor }) => {
          const meta = getDocMeta(period);
          return (
            <Link key={period} href={href}
              className="group block p-5 sm:p-7 bg-white rounded-2xl
                shadow-sm hover:shadow-md transition-all duration-300
                active:scale-[0.98]">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{icon}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor}`}>{status}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 bg-[#0071e3]/10 text-[#0071e3] rounded-full">
                    {meta.version}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-[#1d1d1f]/40 mb-1.5 uppercase tracking-wider font-medium">{PERIOD_DATES[period]}</p>
              <h2 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-[#0071e3] transition-colors tracking-tight leading-snug">
                {meta.title}
              </h2>
              <p className="text-xs text-[#1d1d1f]/50 mb-3 leading-relaxed">{meta.subtitle}</p>
              <p className="text-[13px] text-[#1d1d1f]/60 bg-[#f5f5f7] rounded-xl px-4 py-3 leading-relaxed line-clamp-3">
                {meta.description}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-12 sm:mt-16 text-center text-xs text-[#1d1d1f]/30">
        문서를 클릭하면 해당 기간의 상세 기획을 볼 수 있습니다. 복사 / 다운로드 가능.
      </div>
    </div>
  );
}
