---
id: facts-2026-04-07-escrow-pricing
title: "안심결제 수수료 구조 — 대표님 확인 사실"
date: 2026-04-07
type: facts
artifact_kind: fact-registry
status: final
version: v1
canonical: true
period: cross
tags:
  - topic/payment
  - topic/escrow
  - metric/revenue
  - method/owner-confirmed
summary_line: "안심결제 수수료 구조의 대표님 확인 사실. 학부모 측 수수료 0%, 선생님 측 25%(첫 달), 건당 순매출 직접결제 대비 20.4% 낮음."
key_findings:
  - "학부모 측 안심결제 수수료: 0%. 추가 부과 불가."
  - "선생님 측 안심결제 수수료: 25% (첫 달 수업료 기준, 1회성)"
  - "안심결제 건당 순매출이 직접결제 대비 20.4% 낮은 구조적 갭 존재"
  - "갭 원인 구성: 세션 미정산 45% + 수업료 차이 55%"
  - "코덱스 리뷰에서 가정한 '학부모 측 4%'는 현실 불일치 — 아카이브 3개 파일 경고 주석 수정 완료"
related_ids:
  - codex-review-2026-04-07-06-payment-fintech
corrects_ids:
  - codex-review-2026-04-07-06-payment-fintech
source_paths:
  - cowork-session-2026-04-07
source_type: conversation
source_session_id: cowork-2026-04-07-escrow-archive
series_id: facts-escrow-2026
document_intent: fact-registry
default_authority: owner-confirmed
token_hint: small
---

## 안심결제 수수료 구조 (확인 사실)

### 수수료율

| 대상 | 수수료율 | 비고 |
|------|----------|------|
| 학부모 (수요자) | **0%** | 추가 부과 불가. 코덱스가 가정한 4%는 현실 불일치. |
| 선생님 (공급자) | **25%** | 첫 달 수업료 기준, 1회성 |

### 건당 순매출 구조

안심결제 건당 순매출이 직접결제(usage_fee 선결제) 대비 **20.4% 낮다**.

갭 원인 분해:
- 세션 미정산 — 전체 갭의 약 45%. 안심결제로 세션이 시작되었으나 정산까지 이어지지 않는 건.
- 수업료 차이 — 전체 갭의 약 55%. 안심결제 경유 수업의 평균 수업료가 직접결제 대비 낮음.

### 교정 이력

2026-04-07: 코덱스 리뷰(codex-review-06-payment-fintech)가 "학부모 측 4% 수수료 반영 시 1건당 약 1.14만원" 시나리오를 산출했으나, 학부모 수수료는 실제 0%이므로 해당 수치는 현실과 불일치. 아카이브 3개 파일(코덱스 리뷰 원본, legacy archive, 작업 아카이브)에 경고 주석을 추가하여 수정 완료.
