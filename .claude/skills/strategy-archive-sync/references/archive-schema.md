# 전략 아카이브 디렉토리 스키마

## 디렉토리 구조

```
src/content/archive/
├── documents/
│   ├── roadmap/2026/          # 월별 전략 로드맵
│   ├── roadmap-history/2026/  # 로드맵 과거 버전
│   ├── codex-prompt/2026/     # Codex 검토 요청 원문
│   ├── codex-review/2026/     # Codex 자문 응답
│   ├── data-analysis/2026/    # 갭분석, KPI 분석
│   ├── audit/2026/            # 시스템/프로세스 감사
│   ├── sop/2026/              # 운영 절차서
│   └── legacy-snapshot/2026/  # 이관 전 원본
├── legacy/2026/               # 이관 전 flat archive 원본
├── index.generated.json       # 자동 생성 (rebuild-index.mjs)
└── tags.generated.json        # 자동 생성 (rebuild-index.mjs)
```

## 파일 네이밍 규칙
`{YYYY-MM-DD}-{slug}.md`
- 날짜: 문서 작성일 또는 해당 기간 시작일
- slug: 영문 kebab-case, 내용을 요약하는 짧은 이름
- 예: `2026-04-07-review-01-ai-product-strategy.md`

## 문서 타입 정의

| type | artifact_kind | 한글명 | 설명 |
|------|--------------|--------|------|
| roadmap | report | 로드맵 | 월별 전략 로드맵. canonical=true는 최신본 |
| roadmap-history | report | 로드맵 이력 | 로드맵 이전 버전. canonical=false |
| codex-prompt | prompt | 코덱스 프롬프트 | Codex에 보낸 검토 요청 원문 |
| codex-review | report | 코덱스 자문 | Codex 응답. 자문위원별 분석 |
| data-analysis | report | 데이터 분석 | 갭분석, KPI 분석, 데이터 기반 리포트 |
| audit | report | 감사 | 아키텍처/프로세스 감사 |
| sop | sop | SOP | 운영 절차서 |
| legacy-snapshot | snapshot | 레거시 | 이관 전 원본 스냅샷 |

## 태그 접두사 체계

| 접두사 | 용도 | 예시 |
|--------|------|------|
| topic/ | 주제 | topic/escrow, topic/retention, topic/revenue |
| metric/ | 지표 | metric/ltv, metric/churn, metric/arpu |
| method/ | 방법론 | method/ab-test, method/cohort |
| period/ | 기간 | period/mar, period/apr, period/q2 |
| artifact/ | 산출물 | artifact/prompt, artifact/report |

## index.generated.json 구조
배열 형태. 각 항목은 ArchiveEntry 인터페이스와 동일:
```json
[
  {
    "id": "string (고유 식별자)",
    "title": "string (한글 제목)",
    "date": "YYYY-MM-DD",
    "type": "string (위 타입 중 하나)",
    "artifact_kind": "report | prompt | sop | snapshot",
    "status": "draft | final",
    "version": "v1 | v2 | ...",
    "canonical": true | false,
    "period": "mar | apr | ... (해당 시 빈 문자열)",
    "tags": ["topic/...", "metric/...", ...],
    "summary_line": "1줄 요약",
    "key_findings": ["발견1", "발견2", "발견3"],
    "related_ids": ["다른-문서-id", ...],
    "path": "src/content/archive/documents/... (자동 계산)",
    "token_hint": "small | medium | large"
  }
]
```
date 내림차순 정렬.

## tags.generated.json 구조
태그 → 문서 id 배열 매핑:
```json
{
  "topic/escrow": ["roadmap-2026-06-jun", "data-analysis-..."],
  "period/apr": ["roadmap-2026-04-apr"]
}
```

## UI 라우팅
- `/archive` — index.generated.json 기반 목록 페이지
- `/archive/[id]` — SSG 상세 페이지 (generateStaticParams)
- `/archive/legacy` — 이관 전 flat archive 원본
