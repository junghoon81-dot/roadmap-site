---
id: session-digest-2026-04-07-escrow-archive
title: "세션 기록 — 안심결제 수수료 확인 + 아카이브 메타데이터 시스템 구축"
date: 2026-04-07
type: session-digest
artifact_kind: digest
status: final
version: v1
canonical: true
period: 2026-04
tags:
  - topic/payment
  - topic/escrow
  - topic/archive-system
  - method/codex
  - method/owner-confirmed
summary_line: "안심결제 수수료 구조 확인(학부모 0%), 코덱스 가정 오류 수정, 사실/가설 구분 메타데이터 시스템(document_intent + default_authority + corrects_ids) 전면 구축."
key_findings:
  - "안심결제 학부모 수수료 0% 확인. 코덱스 리뷰의 4% 가정은 현실 불일치 → 아카이브 3개 파일 경고 주석 추가"
  - "건당 순매출 직접결제 대비 20.4% 낮은 구조적 문제 확인. 해결 방향은 추가 논의 필요"
  - "document_intent(proposal/analysis/session-record/fact-registry) + default_authority(proposed/evidence-backed/owner-confirmed/mixed) 메타데이터 도입"
  - "corrects_ids → corrected_by_ids 자동 역참조 + UI 경고 배너 구현"
  - "session-digest, facts 신규 문서 타입 + 트랜스크립트 비공개 저장소 구축"
related_ids:
  - facts-2026-04-07-escrow-pricing
  - codex-review-2026-04-07-06-payment-fintech
  - codex-review-2026-04-07-02-unit-economics
corrects_ids: []
source_paths:
  - cowork-session-2026-04-07
source_type: conversation
source_session_id: cowork-2026-04-07-escrow-archive
series_id: session-digest-2026-04
document_intent: session-record
default_authority: mixed
token_hint: medium
---

## 세션 요약

2026-04-07 코워크 세션에서 진행한 주요 작업 3가지를 기록한다.

## 1. 안심결제 수수료 구조 확인

대표님이 안심결제의 수익 구조 문제를 제기. 아카이브 문서를 조회한 결과, 코덱스 리뷰(codex-review-06-payment-fintech)가 "학부모 측 4% 반영 시" 시나리오를 산출하고 있었음.

**대표님 확인 결과:** 학부모 측 안심결제 수수료는 **0%**이며, 추가 부과가 불가능하다. 코덱스가 가정한 4%는 현실과 불일치.

조치: 코덱스 리뷰 원본, legacy archive, 작업 아카이브 3개 파일에 경고 주석 추가하여 커밋(39c4281).

사실 확인 결과는 별도 facts 문서(facts-2026-04-07-escrow-pricing)로 분리 저장.

## 2. 사실/가설 구분 시스템 구축

코덱스 제안(proposed)을 대표님 확인 사실(owner-confirmed)과 구분하지 못한 것이 이번 오류의 근본 원인. 이를 구조적으로 방지하기 위해 아카이브 메타데이터 시스템을 설계하고, 코덱스 감사를 거쳐 5건의 시정 항목을 구현.

**구현 완료 (커밋 b5e1011):**

1. `document_intent` + `default_authority` 필드: 기존 22개 문서에 일괄 적용. rebuild-index.mjs 검증 추가. UI 상세페이지에 색상 배지 표시.

2. `corrects_ids` → `corrected_by_ids` 교정 관계: corrects_ids는 수동 설정, corrected_by_ids는 rebuild-index.mjs가 자동 생성 (backlinks 패턴). 상세페이지에 빨간 경고 배너(교정됨) / 초록 배너(교정 출처) 표시.

3. `session-digest` + `facts` 신규 타입: TYPE_LABELS, TYPE_COLORS, typeOrder 반영. VALID_TYPES에 추가.

4. 트랜스크립트 비공개 저장: `src/content/archive/transcripts/` 디렉토리 생성, .gitignore에 추가.

5. SKILL.md / archive-schema.md / archive-entry-template.md 전면 업데이트: 새 enum, 규칙, 예시 반영.

## 3. 미해결 사안

안심결제 건당 순매출 20.4% 갭 문제의 해결 방향은 미확정. 아카이브에 기록된 제안(수수료율 22%로 인하 + usage_fee 완전 수금 보장 → 갭 12.5%로 축소)은 코덱스 제안(proposed)이며, 대표님 확정 전략은 아직 없다.

## 결정 사항 요약

| 항목 | 결정 | 권위 수준 |
|------|------|-----------|
| 학부모 안심결제 수수료 | 0% (추가 부과 불가) | owner-confirmed |
| 선생님 안심결제 수수료 | 25% (첫 달, 1회성) | owner-confirmed |
| 건당 순매출 갭 | 직접결제 대비 20.4% 낮음 | evidence-backed |
| 갭 해결 방향 | 미확정 | — |
| 아카이브 메타데이터 시스템 | 5건 구현 완료, 배포 | owner-confirmed |
