# 전략 아카이브 스키마

## 디렉토리 구조

```text
src/content/archive/
├── index.generated.json
├── tags.generated.json
├── legacy/
│   └── 2026/
└── documents/
    ├── roadmap/
    ├── roadmap-history/
    ├── codex-prompt/
    ├── codex-review/
    ├── data-analysis/
    ├── audit/
    └── sop/
```

## 타입 정의

| type | 설명 |
|---|---|
| `roadmap` | 월별 공식 로드맵 |
| `roadmap-history` | 기획 버전 이력 |
| `codex-prompt` | Codex에 입력한 검토 프롬프트 |
| `codex-review` | Codex 답변 요약, 교차 분석 |
| `data-analysis` | DB/재무 기반 자체 분석 |
| `audit` | 감사 요청/결과 문서 |
| `sop` | 운영/검증 SOP |
| `legacy-snapshot` | 예전 단일 아카이브 보존본 |

## 필수 메타데이터

```yaml
id:
title:
date:
type:
tags:
summary_line:
key_findings:
```

## 권장 메타데이터

```yaml
artifact_kind:
status:
version:
canonical:
period:
related_ids:
source_paths:
source_type:
token_hint:
```

## 태그 규칙

태그는 아래 prefix를 우선 사용합니다.

- `topic/*`
- `metric/*`
- `method/*`
- `period/*`
- `artifact/*`

예시:

- `topic/escrow`
- `topic/payment`
- `topic/checkin`
- `metric/revenue`
- `metric/unit-economics`
- `method/codex`
- `method/db-analysis`
- `period/may`
- `artifact/review`

## canonical 규칙

- 기본 목록에는 `canonical=true` 우선 노출
- 버전 이력은 모두 보관
- 최종본만 canonical로 지정

## related_ids 규칙

반드시 아래 둘 중 하나 이상으로 연결합니다.

- 같은 주제 문서
- 같은 입력-출력 관계의 문서

예시:

- `codex-prompt` -> 해당 `codex-review`
- `data-analysis` -> 관련 `roadmap`
- `roadmap-history` -> 최종 `roadmap`
