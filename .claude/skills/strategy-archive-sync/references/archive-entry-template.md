# 아카이브 문서 템플릿

## Frontmatter 템플릿

```yaml
---
id: {type}-{YYYY}-{MM}-{DD}-{slug}
title: "문서 제목 (한글)"
date: "YYYY-MM-DD"
type: roadmap | codex-prompt | codex-review | data-analysis | audit | sop | legacy-snapshot | session-digest | facts
artifact_kind: report | prompt | sop | snapshot | review | digest | fact-registry
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
corrects_ids: []
series_id: standalone
source_session_id: ""
document_intent: proposal | analysis | session-record | fact-registry
default_authority: proposed | evidence-backed | owner-confirmed | mixed
source_paths:
  - "원본 파일 경로 (참고용)"
source_type: manual | codex | docx-convert | session-transcript
token_hint: small | medium | large
---
```

## 필드별 작성 가이드

**id 규칙:**
- `{type}-{date}-{순번 또는 slug}`
- 예: `codex-review-2026-04-07-01-ai-product-strategy`
- 예: `session-digest-2026-04-07-escrow-pricing`
- 예: `facts-escrow-pricing-2026-04`
- 전체 아카이브에서 유일해야 함

**document_intent + default_authority 기본값:**
- codex-review, codex-prompt → `proposal` / `proposed` (미확인 제안)
- data-analysis → `analysis` / `evidence-backed` (데이터 근거)
- session-digest → `session-record` / `mixed` (사실+제안 혼합)
- facts → `fact-registry` / `owner-confirmed` (대표님 확인)
- roadmap → `analysis` / `mixed`
- **절대 규칙: proposed 문서의 수치를 owner-confirmed처럼 인용하지 않는다**

**corrects_ids:**
- 이 문서가 교정하는 기존 문서의 id 목록
- 예: `corrects_ids: [codex-review-2026-04-07-06-payment-fintech]`
- rebuild-index가 대상 문서에 `corrected_by_ids`를 자동 추가
- 상세 페이지에 경고 배너가 자동 표시됨
- `corrected_by_ids`는 자동 생성이므로 frontmatter에 쓰지 않음

**source_session_id:**
- session-digest에서 원본 세션 식별용
- 예: `lilith-2026-04-07`
- 다른 타입에서는 빈 문자열

**token_hint 기준:**
- small: ~2,000 토큰 이하 (짧은 요약/메모/session-digest/facts)
- medium: 2,000~8,000 토큰 (일반 분석/로드맵)
- large: 8,000 토큰 이상 (전체 코덱스 프롬프트, 장문 자문)

**series_id 규칙:**
- 같은 시리즈(월별 로드맵, 코덱스 쓰레드 등)에 동일 series_id 부여
- 독립 문서는 `standalone`
- 예: `roadmap-monthly-2026`, `codex-v6-thread-01`, `codex-review-2026-04`

**canonical 규칙:**
- 같은 series_id 내 최신 버전에만 true
- 이전 버전은 canonical: false + type을 roadmap-history로 변경

**tags 작성:**
- 최소 1개 topic/ 태그 필수
- period/ 태그는 월별 로드맵에 필수
- 태그값은 영문 kebab-case

## 실제 예시 (session-digest)

```yaml
---
id: session-digest-2026-04-07-escrow-pricing
title: "안심결제 수수료 구조 확인 및 아카이브 오류 수정"
date: "2026-04-07"
type: session-digest
artifact_kind: digest
status: final
version: v1
canonical: true
period: ""
tags:
  - topic/escrow
  - topic/payment
summary_line: "학부모 안심결제 수수료 0% 확인. 코덱스 리뷰 학부모 4% 가정 현실 불일치 확인."
key_findings:
  - "학부모 측 안심결제 수수료는 0%. 추가 부과 불가."
  - "안심결제 건당 순매출이 직접결제 대비 20.4% 낮은 구조적 문제"
related_ids:
  - codex-review-2026-04-07-06-payment-fintech
  - data-analysis-2026-04-07-escrow-gap
corrects_ids:
  - codex-review-2026-04-07-06-payment-fintech
series_id: standalone
source_session_id: lilith-2026-04-07
document_intent: session-record
default_authority: mixed
source_paths: []
source_type: session-transcript
token_hint: small
---
```

## 실제 예시 (facts)

```yaml
---
id: facts-escrow-pricing-2026-04
title: "안심결제 수수료 확인 사실"
date: "2026-04-07"
type: facts
artifact_kind: fact-registry
status: final
version: v1
canonical: true
period: ""
tags:
  - topic/escrow
  - topic/payment
summary_line: "안심결제 관련 대표님 확인 사실 레지스트리"
key_findings:
  - "학부모 안심결제 수수료 0%"
  - "안심결제 건당 순매출 직접결제 대비 20.4% 낮음"
related_ids:
  - data-analysis-2026-04-07-escrow-gap
corrects_ids: []
series_id: standalone
source_session_id: lilith-2026-04-07
document_intent: fact-registry
default_authority: owner-confirmed
source_paths: []
source_type: session-transcript
token_hint: small
---
```
