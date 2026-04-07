# 아카이브 엔트리 템플릿

## Markdown 템플릿

```md
---
id: <type>-<yyyy-mm-dd>-<slug>
title: <문서 제목>
date: <yyyy-mm-dd>
type: <roadmap|roadmap-history|codex-prompt|codex-review|data-analysis|audit|sop>
artifact_kind: <prompt|review|report|protocol|snapshot>
status: final
version: v1
canonical: true
period: <mar|apr|may|jun|cross>
tags:
  - topic/<topic-1>
  - topic/<topic-2>
  - method/<method>
summary_line: <90~120자 1줄 요약>
key_findings:
  - <핵심 결론 1>
  - <핵심 결론 2>
  - <핵심 결론 3>
related_ids:
  - <related-id-1>
  - <related-id-2>
source_paths:
  - <absolute-source-path>
source_type: <markdown|docx|mixed>
token_hint: <small|medium|large>
---

## 1줄 요약

<summary_line를 조금 더 자연스럽게 풀어쓴 문장>

## 핵심 결론

- <핵심 결론 1>
- <핵심 결론 2>
- <핵심 결론 3>

## 전문

<본문>
```

## 인덱스 레코드 예시

```json
{
  "id": "data-analysis-2026-04-07-escrow-gap",
  "title": "안심결제 vs 직접결제 순매출 갭 분석",
  "date": "2026-04-07",
  "type": "data-analysis",
  "canonical": true,
  "tags": [
    "topic/escrow",
    "topic/payment",
    "metric/revenue",
    "method/db-analysis"
  ],
  "summary_line": "안심결제 순매출 갭 20.4%의 구조적 원인을 DB와 자금수지표로 분해한 분석입니다.",
  "key_findings": [
    "표면 갭 24.3%는 환불·페이백 반영 후 20.4%로 축소됩니다.",
    "갭의 45%는 세션 미정산, 55%는 평균 과외비 차이에서 발생합니다.",
    "요율 22%와 usage_fee 전액 수금이 실질 갭 축소의 핵심입니다."
  ],
  "path": "src/content/archive/documents/data-analysis/2026/2026-04-07-escrow-gap-analysis.md",
  "related_ids": [
    "codex-prompt-2026-04-07-payment-fintech",
    "roadmap-2026-06-jun"
  ]
}
```

## 최소 품질 기준

- 제목이 구체적인가
- 문서 타입이 명확한가
- 1줄 요약만 읽어도 문서 가치가 보이는가
- 핵심 결론 3줄이 실제로 결론인가
- 관련 문서가 최소 1개 이상 연결되는가
