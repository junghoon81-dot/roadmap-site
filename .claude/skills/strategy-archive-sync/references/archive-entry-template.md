# 아카이브 문서 템플릿

## Frontmatter 템플릿

```yaml
---
id: {type}-{YYYY}-{MM}-{DD}-{slug}
title: "문서 제목 (한글)"
date: "YYYY-MM-DD"
type: roadmap | codex-prompt | codex-review | data-analysis | audit | sop | legacy-snapshot
artifact_kind: report | prompt | sop | snapshot
status: draft | final
version: v1
canonical: true
period: ""
tags:
  - topic/주제명
  - metric/지표명
  - period/월
summary_line: "1줄 요약 (50자 이내 권장)"
key_findings:
  - "핵심 발견 1"
  - "핵심 발견 2"
  - "핵심 발견 3"
related_ids:
  - "관련-문서-id"
source_paths:
  - "원본 파일 경로 (참고용)"
source_type: manual | codex | docx-convert
token_hint: small | medium | large
---
```

## 필드별 작성 가이드

**id 규칙:**
- `{type}-{date}-{순번 또는 slug}`
- 예: `codex-review-2026-04-07-01-ai-product-strategy`
- 예: `roadmap-2026-06-jun`
- 전체 아카이브에서 유일해야 함

**token_hint 기준:**
- small: ~2,000 토큰 이하 (짧은 요약/메모)
- medium: 2,000~8,000 토큰 (일반 분석/로드맵)
- large: 8,000 토큰 이상 (전체 코덱스 프롬프트, 장문 자문)

**canonical 규칙:**
- 같은 주제의 최신 버전에만 true
- 이전 버전은 canonical: false + type을 roadmap-history로 변경

**tags 작성:**
- 최소 1개 topic/ 태그 필수
- period/ 태그는 월별 로드맵에 필수
- 태그값은 영문 kebab-case

## 실제 예시 (codex-review)

```yaml
---
id: codex-review-2026-04-07-01-ai-product-strategy
title: "자문위원 1 — AI 제품 전략"
date: "2026-04-07"
type: codex-review
artifact_kind: report
status: final
version: v1
canonical: true
period: ""
tags:
  - topic/ai-strategy
  - topic/matching
  - method/recommendation
summary_line: "AI 매칭·추천 고도화와 자동화 관점에서 3~6월 로드맵 검토"
key_findings:
  - "체크인 데이터 → 추천이유카드 자동 생성 파이프라인 권고"
  - "taxonomy 설계 시 교사 역량 다차원 벡터화 제안"
  - "AI 중재 시스템의 단계적 자동화 로드맵 제시"
related_ids:
  - "codex-review-2026-04-07-07-cross-analysis"
source_paths:
  - "src/content/archive/작업_아카이브.md (Part 4 lines 1426-1514)"
source_type: manual
token_hint: medium
---
```
