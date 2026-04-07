# 전략 아카이브 시스템 설계안

작성일: 2026-04-07
대상: `roadmap-site` 전략 아카이브 구조 개편 + 코워크 스킬 등록

## 0. 결론

- 현재의 `src/content/archive/작업_아카이브.md` 단일 문서 구조는 10개 안팎까지는 버티지만, 전략 문서가 30개를 넘는 순간 검색성과 컨텍스트 재사용성이 급격히 떨어집니다.
- 권장 구조는 `문서 원문(md)` + `요약 인덱스(JSON)`의 2계층입니다. 원문은 문서 단위로 쪼개고, 검색/필터/컨텍스트 로딩은 인덱스 JSON으로 처리합니다.
- 1차 목표는 UI보다 먼저 "구조화된 저장"입니다. 새 분석이 파일 단위로 쌓이고 태그/요약이 인덱싱되기 시작하면, 다음 분석 세션부터 바로 선택적 컨텍스트 로딩이 가능합니다.
- 기존 `작업_아카이브.md`는 없애지 말고 `legacy snapshot`으로 보존합니다. 다만 기본 화면과 기본 로딩에서는 제외합니다.

## 1. 질문 1 — 아카이브 정보 구조 설계

### 1-1. 권장 디렉토리 구조

```text
src/content/archive/
├── index.generated.json
├── tags.generated.json
├── legacy/
│   └── 2026/
│       └── 2026-04-07-legacy-work-archive.md
└── documents/
    ├── roadmap/
    │   └── 2026/
    ├── roadmap-history/
    │   └── 2026/
    ├── codex-prompt/
    │   └── 2026/
    ├── codex-review/
    │   └── 2026/
    ├── data-analysis/
    │   └── 2026/
    ├── audit/
    │   └── 2026/
    └── sop/
        └── 2026/
```

핵심 원칙:

- 문서 1개 = 파일 1개
- 화면 렌더링용 요약 데이터 = `index.generated.json`
- 태그/토픽 역색인 = `tags.generated.json`
- 기존 단일 대문서 = `legacy/`로 격리

### 1-2. 왜 단일 md가 아니라 `JSON 인덱스 + 다중 md`인가

| 방식 | 장점 | 단점 | 판단 |
|---|---|---|---|
| 단일 md | 구현이 단순 | 검색/필터/부분 로딩이 거의 불가 | 부적합 |
| 다중 md만 사용 | 원문 분리는 쉬움 | 목록/필터 때마다 모든 md를 읽어야 함 | 과도기용 |
| JSON 인덱스 + 다중 md | 검색, 필터, 선택 로딩, UI 확장 모두 가능 | 인덱스 생성 로직이 추가됨 | 최적 |

권장 결정:

- 저장의 기준은 md
- 탐색의 기준은 generated JSON
- UI와 코워크 컨텍스트 로딩은 JSON만 먼저 읽고, 원문은 필요할 때만 로딩

### 1-3. 문서 메타데이터 스키마

각 문서의 frontmatter 권장 스키마:

```yaml
---
id: data-analysis-2026-04-07-escrow-gap
title: 안심결제 vs 직접결제 순매출 갭 분석
date: 2026-04-07
type: data-analysis
artifact_kind: report
status: final
version: v1
canonical: true
period: may
tags:
  - topic/escrow
  - topic/payment
  - metric/revenue
  - metric/unit-economics
  - method/db-analysis
summary_line: 안심결제 순매출 갭 20.4%의 원인을 DB와 자금수지표로 분해한 분석입니다.
key_findings:
  - 표면 갭 24.3%는 환불·페이백 반영 후 20.4%로 축소됩니다.
  - 갭의 45%는 세션 미정산, 55%는 평균 과외비 차이에서 발생합니다.
  - 요율 22%와 usage_fee 전액 수금이 실질 갭 축소의 핵심입니다.
related_ids:
  - codex-prompt-2026-04-07-payment-fintech
  - codex-review-2026-04-07-unit-economics-cross
source_paths:
  - /Users/lilith/김과외_안심결제_갭분석_20260407.docx
source_type: docx
token_hint: medium
---
```

필수 필드:

- `id`
- `title`
- `date`
- `type`
- `tags`
- `summary_line`
- `key_findings`

강력 권장 필드:

- `related_ids`
- `version`
- `canonical`
- `source_paths`
- `token_hint`

### 1-4. 타입 체계

| type | 용도 |
|---|---|
| `roadmap` | 월별 공식 로드맵 본문 |
| `roadmap-history` | v1~v9 같은 기획 변경 이력 |
| `codex-prompt` | Codex에 던진 검토 프롬프트 원문 |
| `codex-review` | Codex 답변 요약, 교차 분석, 검토 결과 |
| `data-analysis` | DB/재무/자금수지표 기반 자체 분석 |
| `audit` | Codex 감사 프롬프트, 감사 결과 |
| `sop` | 운영/검증/인수인계 SOP |
| `legacy-snapshot` | 과거 단일 아카이브 백업 |

### 1-5. 요약 계층 설계

문서마다 아래 3계층을 둡니다.

1. `summary_line`
하나의 문장, 90~120자 이내. 인덱스 카드와 검색 결과에서만 사용합니다.

2. `key_findings`
핵심 결론 3줄. 선택적 컨텍스트 로딩의 1차 재료입니다.

3. `full_text`
전문 또는 정리본. 상세 페이지와 실제 분석 재사용에 사용합니다.

권장 본문 구조:

```md
## 1줄 요약
...

## 핵심 결론
- ...
- ...
- ...

## 전문
...
```

### 1-6. 인덱스/목차 자동 생성 방식

권장 생성물:

- `index.generated.json`: 문서 목록, 정렬용 메타데이터, 요약, 관련 링크
- `tags.generated.json`: 태그별 문서 id 목록, 카운트, 최신 문서

권장 생성 로직:

1. `src/content/archive/documents/**/*.md` 스캔
2. frontmatter 파싱
3. 누락 필드 검증
4. 날짜 내림차순 정렬
5. `index.generated.json` 출력
6. 태그별 역색인 생성 후 `tags.generated.json` 출력

권장 스크립트 이름:

- `scripts/archive/build-index.mjs`

## 2. 질문 2 — 최초 1회 마이그레이션 계획

### 2-1. 분류/배치 매핑표

| 원본 | 새 분류 | 권장 경로 |
|---|---|---|
| `src/content/mar/3월_로드맵.md` | roadmap | `src/content/archive/documents/roadmap/2026/2026-03-roadmap-mar.md` |
| `src/content/apr/4월_로드맵.md` | roadmap | `src/content/archive/documents/roadmap/2026/2026-04-roadmap-apr.md` |
| `src/content/may/5월_로드맵.md` | roadmap | `src/content/archive/documents/roadmap/2026/2026-05-roadmap-may.md` |
| `src/content/jun/6월_로드맵.md` | roadmap | `src/content/archive/documents/roadmap/2026/2026-06-roadmap-jun.md` |
| `roadmap-site/codex-prompts.md` 안 1~3번 | codex-prompt | 문서 3개로 분리 저장 |
| `roadmap-site/codex-prompts-2.md` 안 4~6번 | codex-prompt | 문서 3개로 분리 저장 |
| `코덱스_검토1_사업성_매출.md` | codex-prompt | `.../codex-prompt/2026/2026-04-07-review-01-business-revenue.md` |
| `코덱스_검토1_재이용률_매출논리.md` | codex-prompt | `.../codex-prompt/2026/2026-04-07-review-01-reuse-revenue.md` |
| `코덱스_검토2_실행가능성_리소스.md` | codex-prompt | `.../codex-prompt/2026/2026-04-07-review-02-feasibility-resource.md` |
| `코덱스_검토2_에이전트_전략.md` | codex-prompt | `.../codex-prompt/2026/2026-04-07-review-02-agent-strategy.md` |
| `코덱스_검토3_설문_분쟁중재_설계.md` | codex-prompt | `.../codex-prompt/2026/2026-04-07-review-03-survey-mediation.md` |
| `코덱스_검토3_전략_경쟁.md` | codex-prompt | `.../codex-prompt/2026/2026-04-07-review-03-strategy-competition.md` |
| `코덱스_v9.1_검토1_체크인_코칭리포트_중재설계.md` | codex-prompt | `.../codex-prompt/2026/2026-04-07-v9-1-review-01-checkin-coaching-mediation.md` |
| `코덱스_v9.1_검토2_매출논리_지표_데이터전략.md` | codex-prompt | `.../codex-prompt/2026/2026-04-07-v9-1-review-02-revenue-kpi-data.md` |
| `코덱스_v9.1_검토3_에이전트전략_선생님경험.md` | codex-prompt | `.../codex-prompt/2026/2026-04-07-v9-1-review-03-agent-teacher-experience.md` |
| `codex-audit-A~E...md` | sop 또는 audit | SOP면 `sop/`, 평가 보고면 `audit/` |
| `codex-audit-ai-tips-html.md` | audit | `.../audit/2026/2026-04-02-ai-tips-html-audit-request.md` |
| `codex-audit-rescore-20260405.md` | audit | `.../audit/2026/2026-04-05-audit-rescore.md` |
| `codex-audit-roadmap-site.md` | audit | `.../audit/2026/2026-04-07-roadmap-site-full-audit.md` |
| `김과외_5월패치_기획_로드맵_v1.md ~ v9.md` | roadmap-history | 버전별 파일 전부 보관 |
| `김과외_5월패치_기획_로드맵.md` | roadmap-history | `v1`과 중복이면 alias 처리 또는 제외 |
| `김과외_안심결제_갭분석_20260407.docx` | data-analysis | `.../data-analysis/2026/2026-04-07-escrow-gap-analysis.md` |
| `src/content/archive/작업_아카이브.md` | legacy-snapshot | `src/content/archive/legacy/2026/2026-04-07-legacy-work-archive.md` |

중요:

- `codex-prompts.md`, `codex-prompts-2.md`는 "파일 1개"가 아니라 "프롬프트 1개 = 문서 1개"로 분리해야 합니다.
- 기존 `작업_아카이브.md` 안에 들어 있는 Codex 답변 6개와 교차 분석 1개는 별도 `codex-review` 문서로 다시 뽑아내야 합니다.

### 2-2. 각 파일에서 추출해야 할 메타데이터

모든 문서 공통:

- 제목: H1 우선, 없으면 파일명
- 날짜: 문서명 포함 날짜 > 본문 명시 날짜 > 파일 수정일
- 유형: 위 `type` 체계에 따라 수동 지정
- 태그: 주제 2~4개 + 메서드 1개 + 지표/기능 1~3개
- 1줄 요약: 첫 문단 또는 Executive Summary를 압축
- 핵심 결론 3줄: 결론/권고/시사점 요약
- 관련 문서: 같은 주제, 같은 버전 계열, 같은 입력-출력 쌍

파일군별 추가 규칙:

| 파일군 | 추가 메타데이터 |
|---|---|
| roadmap | `period`, `canonical=true`, `status=published` |
| roadmap-history | `version`, `supersedes`, `superseded_by`, `canonical=false` |
| codex-prompt | `artifact_kind=prompt`, `paired_review_ids` |
| codex-review | `artifact_kind=review`, `source_prompt_ids` |
| data-analysis | `source_type`, `data_source`, `analysis_period` |
| sop | `artifact_kind=protocol`, `version`, `owner` |
| audit | `artifact_kind=audit`, `target_scope` |

### 2-3. 중복 콘텐츠 처리 방침

권장 방침:

- 로드맵 v1~v9는 전부 보관합니다.
- 기본 목록과 기본 검색 결과에서는 `canonical=true` 문서만 우선 노출합니다.
- 과거 버전은 상세 페이지의 "버전 이력" 탭 또는 토글에서 노출합니다.
- 완전 중복 파일은 하나만 canonical로 두고, 나머지는 `alias_of` 또는 `source_paths`에 흡수합니다.

구체 판단:

- `김과외_5월패치_기획_로드맵.md`와 `..._v1.md`가 본문 동일하면 둘 다 일반 문서로 노출하지 말고 하나만 canonical 처리합니다.
- `작업_아카이브.md`는 중복이어도 삭제하지 않고 legacy snapshot으로 남깁니다.
- 동일 주제의 Codex 검토 프롬프트가 여러 버전이면, 질문 구조가 바뀌었는지 기준으로 새 문서 여부를 판단합니다.

### 2-4. 마이그레이션 실행 순서

1. 인벤토리 작성
현재 파일 목록을 전부 나열하고 `type`, `date`, `status`, `canonical 후보`를 붙입니다.

2. 레거시 분리
기존 `작업_아카이브.md`를 `legacy`로 이동 대상 지정하고, 내부의 "Codex 답변 6개 + 교차 분석 1개"를 추출 목록으로 만듭니다.

3. 프롬프트 분할
`codex-prompts*.md`를 프롬프트 단위 6개 파일로 분리합니다.

4. 로드맵/버전 이력 정리
월별 공식 로드맵과 5월 기획 버전 이력을 분리 저장합니다.

5. 데이터 분석 변환
`.docx`를 markdown으로 정규화하고 frontmatter를 추가합니다.

6. SOP/audit 정리
프롬프트형 문서와 결과형 문서를 구분해 `sop`와 `audit`로 나눕니다.

7. 인덱스 생성
모든 문서 frontmatter 기준으로 generated JSON을 만듭니다.

8. 검증
누락, 중복, 링크 오류, 필터 결과를 확인합니다.

### 2-5. 예상 소요 시간

전체 1회 정리 기준:

| 작업 | 예상 시간 |
|---|---|
| 파일 인벤토리 + 분류 | 40분 |
| `codex-prompts*.md` 6개 분할 | 40분 |
| 레거시 아카이브 분해 | 90분 |
| 로드맵 v1~v9 메타데이터 정리 | 60분 |
| SOP/audit 정리 | 50분 |
| DOCX → markdown 정규화 | 30분 |
| 인덱스 생성/검증 | 40분 |
| 합계 | 약 5시간 50분 |

현실적 운영안:

- 1세션차: 구조 생성 + 최우선 문서 10~12개 이관
- 2세션차: 레거시 분해 + 나머지 버전 이력 이관

### 2-6. 마이그레이션 후 검증 방법

검증 체크리스트:

- 각 원본 파일이 정확히 한 개 이상의 구조화 문서로 매핑되었는가
- `index.generated.json` 문서 수와 실제 md 파일 수가 일치하는가
- 태그 검색 예시 3개가 기대 문서를 반환하는가
- 동일 주제 문서가 날짜순으로 정렬되는가
- `canonical` 문서만 보는 기본 목록에서 최신본이 노출되는가
- 레거시 snapshot이 기본 목록에서 숨겨지는가
- 사이트 빌드가 통과하는가

샘플 질의로 검증:

- `topic/escrow`
- `topic/checkin`
- `metric/revenue`
- `type=roadmap-history + period=may`

## 3. 질문 3 — 코워크 스킬 설계

### 3-1. 스킬 목적

분석이 끝났을 때 아래 4가지를 자동화합니다.

- 메타데이터 추출
- 문서 파일 생성 또는 갱신
- 인덱스 재생성
- 선택 시 git commit/push

### 3-2. 스킬 동작 범위

저장 대상:

- 전략 분석
- Codex 감사
- Codex 검토 프롬프트
- Codex 답변 요약
- 데이터 분석
- 로드맵 기획 버전

저장 제외:

- 단순 코드 수정 로그
- 빌드 실패 로그만 있는 세션
- 내용이 1~2문장 수준인 메모

### 3-3. 수동 트리거와 자동 트리거

수동 트리거:

- "아카이브에 저장해"
- "전략 아카이브 업데이트해"
- "이 분석 보관해"

자동 트리거:

- 현재 세션 산출물이 전략 문서이며
- 제목, 유형, 핵심 결론 3줄을 안정적으로 추출할 수 있고
- 같은 `id` 또는 같은 `title+date`가 아직 인덱스에 없을 때

자동 저장은 공격적으로 하지 않는 편이 맞습니다. 전략 문서는 품질이 더 중요하므로, 기본값은 "자동 제안 + 수동 확정"이 안전합니다.

### 3-4. 아카이브 엔트리 템플릿

```md
---
id: codex-review-2026-04-07-payment-fintech-summary
title: 결제·핀테크 자문 핵심 요약
date: 2026-04-07
type: codex-review
artifact_kind: review
status: final
version: v1
canonical: true
tags:
  - topic/payment
  - topic/escrow
  - metric/revenue
  - method/codex
summary_line: 안심결제 구조를 수익성과 운영 리스크 관점에서 재정리한 Codex 자문 요약입니다.
key_findings:
  - 현재 수익성 저하의 핵심은 요율보다 미정산과 평균 과외비 차이입니다.
  - 수수료 설계는 환불 구조와 함께 봐야 실제 갭이 보입니다.
  - 전국 확대 이전에 정산 구조 교정이 선행되어야 합니다.
related_ids:
  - data-analysis-2026-04-07-escrow-gap
  - roadmap-2026-06-jun
source_paths:
  - /Users/lilith/roadmap-site/src/content/archive/작업_아카이브.md
source_type: markdown
token_hint: medium
---

## 1줄 요약

안심결제 수익성 문제를 요율 단일 이슈가 아니라 정산률, 환불, 과외비 구조까지 포함해 재설계해야 한다는 자문입니다.

## 핵심 결론

- 표면 수수료율 차이보다 실제 순매출 구조를 먼저 봐야 합니다.
- 안심결제는 환불/페이백 비용이 거의 없으므로 단순 비교가 왜곡됩니다.
- 가격정책은 6월 전국 확대 문서와 함께 읽어야 합니다.

## 전문

...
```

### 3-5. 인덱스 자동 갱신 로직

권장 순서:

1. 새 md 파일 저장
2. 기존 `documents/**/*.md` 전체 스캔
3. frontmatter 검증
4. `index.generated.json` 재생성
5. `tags.generated.json` 재생성
6. 중복 id 또는 누락 필드 검출 시 중단

### 3-6. 에러 처리 원칙

| 상황 | 처리 |
|---|---|
| git worktree가 이미 더러움 | 내 변경만 분리하고 자동 커밋은 중단 |
| 같은 slug 문서가 이미 있음 | 새 버전 생성 또는 기존 문서 갱신 여부를 보고 |
| frontmatter 누락 | 저장 중단, 누락 필드 보고 |
| 인덱스 생성 실패 | 원문 파일 유지, index는 건드리지 않음 |
| 빌드 실패 | commit/push 중단, 에러 원문 보고 |
| push 실패 | 로컬 commit만 남기고 remote 반영 중단 보고 |

권장 롤백 원칙:

- `git reset --hard` 금지
- 내 생성 파일만 개별 수정 또는 개별 제거
- 빌드 실패 시 자동 push 금지

## 4. 질문 4 — 컨텍스트 활용 구조

### 4-1. 태그 체계

태그는 flat text보다 3축 prefix 체계가 좋습니다.

권장 prefix:

- `topic/*`: 주제
- `metric/*`: 지표
- `method/*`: 분석 방법
- `period/*`: 월 로드맵
- `artifact/*`: 문서 성격

예시:

- `topic/escrow`
- `topic/payment`
- `topic/checkin`
- `topic/mediation`
- `metric/revenue`
- `metric/unit-economics`
- `method/codex`
- `method/db-analysis`
- `period/may`
- `period/jun`

### 4-2. 선택적 컨텍스트 로딩 규칙

권장 로딩 순서:

1. 사용자의 새 요청에서 핵심 키워드 추출
2. `index.generated.json`에서 태그와 제목으로 1차 필터
3. `summary_line`과 `key_findings`만 읽고 상위 3~5개 후보 선정
4. 그 중 직접 관련 문서만 전문 로딩
5. 사용자가 추가 지정한 문서는 강제 포함

안심결제 예시:

- 1차 후보: `topic/escrow`, `topic/payment`, `metric/revenue`
- 자동 선택 문서:
  - 안심결제 갭 분석
  - Codex 결제·핀테크 프롬프트/리뷰
  - Codex 유닛이코노믹스 자문
  - 6월 로드맵 안심결제 전국 확대 파트
- 제외 문서:
  - 체크인 UX
  - SEO
  - 일반 SOP

### 4-3. 코워크 스킬 연동

분석 시작 시 사용할 별도 로더 스킬의 규칙:

- 사용자가 주제를 말하면 관련 태그 2~3개를 먼저 추정
- 인덱스에서 상위 문서 5개 이하만 불러옴
- 기본은 요약만 로딩
- 필요 시 원문 1~2개만 추가 로딩

### 4-4. 수동 오버라이드

반드시 지원해야 할 문장:

- "X 분석도 참고해"
- "로드맵 v5도 같이 봐"
- "SOP는 빼고 전략 문서만 봐"

이 경우:

- 태그 필터 결과 위에 수동 지정 문서를 merge
- 중복은 제거
- 수동 지정 문서는 우선순위를 최상위로 올림

## 5. 질문 5 — 웹사이트 UI 개선

### 5-1. 카드 그리드 vs 목록 vs 트리

결론:

- 기본 아카이브 페이지는 `밀도 높은 목록형`이 최적입니다.
- 카드 그리드는 홈 요약 섹션에는 좋지만, 30개 이상에서는 스캔 효율이 낮습니다.
- 트리는 구조는 예쁘지만 필터 조합과 최신순 탐색에 약합니다.

권장 UI:

- 좌측: 필터 패널
- 우측: 날짜순 목록
- 각 행: 날짜, type badge, 제목, 1줄 요약, 핵심 태그 3개

### 5-2. 필터/검색

필수 필터:

- 유형별 (`roadmap`, `codex-review`, `data-analysis`, `audit`, `sop`)
- 태그별
- 날짜 범위
- canonical only 토글

검색 입력창은 제목 + 1줄 요약 + 태그만 대상으로 시작하는 것이 가볍습니다.

### 5-3. 상세 보기

권장 라우팅:

- `/archive` = 목록
- `/archive/[slug]` = 상세

상세 보기에는:

- 1줄 요약
- 핵심 결론 3줄
- 관련 문서
- 버전 이력
- 전문

### 5-4. 기술 구현

현재 스택 기준 최적안:

- 상세 문서: markdown 파일
- 목록 데이터: generated JSON
- 상세 페이지: Next.js 서버 컴포넌트 + 정적 생성
- 필터 UI: client component

필요 변경:

- `src/app/archive/page.tsx`를 목록형으로 변경
- `src/app/archive/[slug]/page.tsx` 추가
- `src/lib/archive.ts` 추가
- frontmatter 파싱용 `gray-matter` 또는 동등 로직 추가

### 5-5. 성능 관점

장점:

- 목록 페이지는 JSON만 읽으므로 가벼움
- 상세 페이지는 문서 1개만 읽음
- 500KB 이상의 단일 md를 통째로 렌더링하는 문제를 피함

## 6. 질문 6 — 실행 우선순위

### Phase 1 — 이번 주

목표: 다음 분석 세션부터 선택적 컨텍스트 로딩 가능하게 만들기

1. 새 아카이브 구조 확정
2. `documents/` + `index.generated.json` 체계 도입
3. 최우선 문서 10~12개 이관
4. 코워크 스킬 등록
5. 레거시 snapshot 분리

산출물:

- 구조화된 md 10개+
- 인덱스 JSON
- 저장 스킬

### Phase 2 — 다음 주

목표: 웹사이트에서 구조화 아카이브 탐색 가능하게 만들기

1. `/archive` 목록 UI 구현
2. `/archive/[slug]` 상세 페이지 구현
3. 태그/유형 필터 구현
4. 관련 문서 링크 구현
5. 나머지 레거시 문서 이관

### Phase 3 — 이후

목표: 아카이브를 "살아 있는 전략 메모리"로 만들기

1. 분석 시작용 관련 문서 로더 스킬 추가
2. topic page 또는 saved views 도입
3. 버전 diff 보기
4. 중요 문서 featured pin
5. 자동 커밋/배포 워크플로 안정화

## 7. 최종 권장안

가장 먼저 할 일은 UI 개편이 아니라 저장 구조 전환입니다.

- `flat archive`를 `document archive`로 바꾸고
- 모든 문서에 frontmatter 요약을 붙이고
- generated index를 만들고
- 저장 스킬을 등록하면

그 순간부터 새 분석 세션에서 "관련 분석 4개만 선택 로딩"이 가능해집니다.

즉시 효과 기준의 최우선 순서는 아래와 같습니다.

1. 문서 단위 분리 구조 도입
2. 인덱스 JSON 생성
3. 저장 스킬 등록
4. 안심결제/결제/Codex 자문/로드맵 핵심 1차 이관
5. 이후에 UI 개편
