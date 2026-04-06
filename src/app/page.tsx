import Link from 'next/link';

/* ── 4개 근본 축 ── */
const axes = [
  {
    num: '1',
    color: '#ff3b30',
    title: '매칭 후 관계 쌓기',
    lever: '재이용률',
    why: '매칭 한 번 하면 카톡으로 빠지고 관계가 끊긴다. 가장 급한 문제.',
    tag: '가장 급함',
  },
  {
    num: '2',
    color: '#ff9500',
    title: '결제 구조 정비',
    lever: 'take rate',
    why: '안심결제 전국 확대 + 요금역전 해소. 직거래 이탈 차단.',
    tag: '구조적',
  },
  {
    num: '3',
    color: '#0071e3',
    title: '성사율 올리기',
    lever: '성사율',
    why: '판단 시스템 → AI 에이전트 수준까지. 데이터가 시간이 만드는 자산.',
    tag: '핵심 경쟁력',
  },
  {
    num: '4',
    color: '#34c759',
    title: '유입 확대',
    lever: '유입',
    why: '전환율 개선 위에서 유입을 늘려야 효과가 곱해진다.',
    tag: '병행',
  },
];

/* ── 월별 로드맵 데이터 ── */
const months: {
  month: string;
  label: string;
  statusColor: string;
  status: string;
  highlight?: boolean;
  link?: string;
  items: { axis: number; text: string }[];
}[] = [
  {
    month: '3월',
    label: '기반 구축',
    status: '4/13 배포',
    statusColor: 'bg-[#ff9500]/10 text-[#ff9500]',
    link: '/roadmap/mar',
    items: [
      { axis: 1, text: '수업료 납부요청서 자동발송, 후기요청 알림톡' },
      { axis: 3, text: '공고 UX 개편(경쟁강도), 소개서 구조화, AI 자연어 검색' },
    ],
  },
  {
    month: '4월',
    label: '매출 장치',
    status: '진행',
    statusColor: 'bg-[#ff9500]/10 text-[#ff9500]',
    link: '/roadmap/apr',
    items: [
      { axis: 1, text: '성사누락·시범전환·FOMO·리뷰알림·휴면깨우기·수업결과설문' },
      { axis: 3, text: '선생님부스트, 공고이탈복구' },
      { axis: 4, text: 'SEO 프로그래매틱 랜딩 10만+페이지' },
    ],
  },
  {
    month: '5월',
    label: '데이터 축적',
    status: '핵심',
    statusColor: 'bg-[#ff3b30]/10 text-[#ff3b30]',
    link: '/roadmap/may',
    items: [
      { axis: 1, text: '체크인 파이프라인 MVP (Pulse+코칭리포트+중재+재매칭)' },
      { axis: 3, text: '프로필 입력률 끌어올리기, 추천이유카드 v2-A, 플레이빙, taxonomy 설계' },
    ],
  },
  {
    month: '6월',
    label: '판단 시스템',
    status: '핵심',
    statusColor: 'bg-[#ff3b30]/10 text-[#ff3b30]',
    link: '/roadmap/jun',
    items: [
      { axis: 1, text: '이상징후 감지 v1, 설문요청 4시점 확장' },
      { axis: 2, text: '안심결제 전국 확대 + 요금역전 해소' },
      { axis: 3, text: '추천이유카드에 실제 수업성과 반영, taxonomy 장착' },
    ],
  },
  {
    month: '7월',
    label: 'AI 매칭',
    status: '성수기',
    statusColor: 'bg-[#af52de]/10 text-[#af52de]',
    highlight: true,
    items: [
      { axis: 1, text: '재매칭 자동 추천 v1, 다른 과목 원클릭 재매칭' },
      { axis: 2, text: '안심결제 지역 확대 (현재 서울만 → 수도권+광역시)' },
      { axis: 3, text: '공고 즉시 AI 매칭 추천 (적합 선생님 3명 + 추천이유카드)' },
      { axis: 4, text: '성수기 마케팅 (SEO x 높아진 성사율)' },
    ],
  },
  {
    month: '8월',
    label: '시스템 고도화',
    status: '계획',
    statusColor: 'bg-[#0071e3]/10 text-[#0071e3]',
    items: [
      { axis: 1, text: '코칭리포트 AI 자동화, 선생님 등급제 v1' },
      { axis: 2, text: '안심결제 선생님 서브몰 등록률 개선 + 정산 주기 최적화' },
      { axis: 3, text: '매칭 알고리즘에 taxonomy 피드백 루프 적용' },
      { axis: 4, text: '휴면 학부모 21만명 롤링 알림톡' },
    ],
  },
  {
    month: '9월',
    label: '관계 대시보드',
    status: '성수기2',
    statusColor: 'bg-[#af52de]/10 text-[#af52de]',
    items: [
      { axis: 1, text: '교육 관계 대시보드 (학부모 수업현황, 선생님 코칭현황)' },
      { axis: 2, text: '안심결제 전국 확대 완료 + 직접결제 공고 전환 유도' },
      { axis: 3, text: '이상징후 감지 v2, 선생님 평가 모델 v1' },
      { axis: 4, text: '추천인 프로그램 (만족 학부모 지인 추천)' },
    ],
  },
  {
    month: '10월',
    label: 'AI 에이전트',
    status: '계획',
    statusColor: 'bg-[#0071e3]/10 text-[#0071e3]',
    items: [
      { axis: 1, text: '재매칭 자동화 v2 (이전 불만사유 반영), LTV 세그먼트' },
      { axis: 2, text: '프리미엄 결제 옵션 검토' },
      { axis: 3, text: 'AI 에이전트 매칭 v1 (대화형 조건 파악 → 추천)' },
      { axis: 4, text: '공급 사막 과목 타겟 선생님 모집' },
    ],
  },
  {
    month: '11월',
    label: '에이전트 고도화',
    status: '계획',
    statusColor: 'bg-[#0071e3]/10 text-[#0071e3]',
    items: [
      { axis: 1, text: '성과 리포트 자동 생성, 선생님 교체 시점 자동 감지' },
      { axis: 2, text: 'take rate 분석 + 수수료 구조 최적화' },
      { axis: 3, text: 'AI 에이전트 매칭 v2 (멀티턴, 실시간 추천), taxonomy v2' },
      { axis: 4, text: 'SEO + AI 매칭 데이터 연동' },
    ],
  },
  {
    month: '12월',
    label: '교육 OS v1',
    status: '목표',
    statusColor: 'bg-[#34c759]/10 text-[#34c759]',
    items: [
      { axis: 1, text: '교육 OS v1 — 매칭~수업~종료 전 과정 김과외 내 완결' },
      { axis: 2, text: '26년 결제 구조 고도화 계획 (구독형/프리미엄)' },
      { axis: 3, text: 'AI 에이전트 외부 대응 준비, 판단 데이터 자산화' },
      { axis: 4, text: '26년 유입 전략 수립 (AI 에이전트 시대 SEO 재정의)' },
    ],
  },
];

const axisColors = ['', '#ff3b30', '#ff9500', '#0071e3', '#34c759'];
const axisDots = ['', '①', '②', '③', '④'];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* ── Hero ── */}
      <div className="text-center mb-10 sm:mb-14">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.08] mb-3">
          김과외 <span className="text-[#0071e3]">2026 프로덕트 로드맵</span>
        </h1>
        <p className="text-[#1d1d1f]/60 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          검색 플랫폼 → 판단 보조 시스템 → 교육 관계 운영 플랫폼(교육 OS)
        </p>
      </div>

      {/* ── 현황 숫자 ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 sm:mb-14">
        {[
          { label: '총 사용자', value: '237만', sub: '' },
          { label: '등록 선생님', value: '65만', sub: '' },
          { label: '25년 매출', value: '~81억', sub: '114,159건' },
          { label: '핵심 병목', value: '재이용률', sub: '매칭 후 관계 단절' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm text-center">
            <p className="text-[11px] text-[#1d1d1f]/40 uppercase tracking-wider font-medium mb-1">{label}</p>
            <p className="text-xl sm:text-2xl font-semibold tracking-tight">{value}</p>
            {sub && <p className="text-[11px] text-[#1d1d1f]/40 mt-0.5">{sub}</p>}
          </div>
        ))}
      </div>

      {/* ── 매출 공식 ── */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm mb-10 sm:mb-14">
        <h2 className="text-xs font-semibold text-[#1d1d1f]/40 uppercase tracking-widest mb-4">매출 공식</h2>
        <p className="text-lg sm:text-xl font-semibold tracking-tight text-center mb-5">
          매출 = <span className="text-[#34c759]">유입</span> ×{' '}
          <span className="text-[#0071e3]">성사율</span> ×{' '}
          <span className="text-[#ff9500]">건당 수수료</span> ×{' '}
          <span className="text-[#ff3b30]">재이용률</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {axes.map(({ num, color, title, lever, why, tag }) => (
            <div key={num} className="rounded-xl p-4" style={{ backgroundColor: `${color}08` }}>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                  style={{ backgroundColor: color }}
                >
                  {num}
                </span>
                <span className="text-sm font-semibold" style={{ color }}>{title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium ml-auto" style={{ backgroundColor: `${color}15`, color }}>{tag}</span>
              </div>
              <p className="text-[12px] text-[#1d1d1f]/50 leading-relaxed">{why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 전략 흐름 ── */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm mb-10 sm:mb-14">
        <h2 className="text-xs font-semibold text-[#1d1d1f]/40 uppercase tracking-widest mb-4">전략 흐름</h2>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0 justify-center text-sm">
          {[
            { text: '3–4월 기반 구축', color: '#ff9500' },
            { text: '5–6월 데이터 + 판단 시스템', color: '#ff3b30' },
            { text: '7월 AI 즉시 매칭', color: '#af52de' },
            { text: '10–11월 AI 에이전트', color: '#0071e3' },
            { text: '12월 교육 OS', color: '#34c759' },
          ].map(({ text, color }, i, arr) => (
            <div key={text} className="flex items-center">
              <span className="px-3 py-1.5 rounded-full text-[12px] font-medium" style={{ backgroundColor: `${color}10`, color }}>{text}</span>
              {i < arr.length - 1 && <span className="hidden sm:inline text-[#1d1d1f]/20 mx-1">→</span>}
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12px] text-[#1d1d1f]/40 text-center">
          전환율 개선이 먼저 → 유입 확대는 그 위에서. 효과가 곱해지는 구조.
        </p>
      </div>

      {/* ── 월별 로드맵 테이블 ── */}
      <div className="mb-10 sm:mb-14">
        <h2 className="text-xs font-semibold text-[#1d1d1f]/40 uppercase tracking-widest mb-5 px-1">3월–12월 월별 로드맵</h2>
        <div className="space-y-3">
          {months.map(({ month, label, status, statusColor, highlight, link, items }) => {
            const inner = (
              <div
                className={`bg-white rounded-2xl p-5 sm:p-6 shadow-sm transition-all duration-200 ${
                  link ? 'hover:shadow-md cursor-pointer active:scale-[0.99]' : ''
                } ${highlight ? 'ring-2 ring-[#af52de]/30' : ''}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg sm:text-xl font-bold tracking-tight min-w-[48px]">{month}</span>
                  <span className="text-[13px] font-semibold text-[#1d1d1f]/70">{label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor}`}>{status}</span>
                  {link && (
                    <span className="text-[10px] text-[#0071e3]/60 ml-auto hidden sm:inline">상세 보기 →</span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {items.map(({ axis, text }, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span
                        className="text-[11px] font-bold mt-0.5 shrink-0"
                        style={{ color: axisColors[axis] }}
                      >
                        {axisDots[axis]}
                      </span>
                      <span className="text-[13px] text-[#1d1d1f]/70 leading-relaxed">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            );

            return link ? (
              <Link key={month} href={link} className="block">
                {inner}
              </Link>
            ) : (
              <div key={month}>{inner}</div>
            );
          })}
        </div>
      </div>

      {/* ── 축 범례 ── */}
      <div className="flex flex-wrap gap-3 justify-center mb-10 sm:mb-14">
        {axes.map(({ num, color, title }) => (
          <div key={num} className="flex items-center gap-1.5">
            <span
              className="w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
              style={{ backgroundColor: color }}
            >
              {num}
            </span>
            <span className="text-[12px] text-[#1d1d1f]/50">{title}</span>
          </div>
        ))}
      </div>

      {/* ── 근본 논리 ── */}
      <div className="bg-[#1d1d1f] rounded-2xl p-6 sm:p-8 text-white/90 text-center mb-10">
        <p className="text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          매칭 판단 데이터는 시간이 만드는 자산입니다.<br className="hidden sm:inline" />{' '}
          지금 시작하지 않으면 1년 뒤에도 &ldquo;프로필 보여주는 플랫폼&rdquo;에 머물게 됩니다.
        </p>
        <p className="text-xs text-white/40 mt-3">
          김과외의 본질 재정의: 과외 선생님을 찾는 곳 → 교육 판단을 안전하게 위임할 수 있는 시스템
        </p>
      </div>

      {/* ── Footer ── */}
      <div className="text-center text-xs text-[#1d1d1f]/30">
        3–6월 카드를 클릭하면 해당 기간의 상세 기획을 볼 수 있습니다. 복사 / 다운로드 가능.
      </div>
    </div>
  );
}
