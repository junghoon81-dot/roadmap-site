# 전략 아카이브 동기화 스킬

## 트리거
- "아카이브에 저장해", "전략 아카이브 업데이트해", "아카이브 추가해"
- "인덱스 재생성해", "아카이브 인덱스 리빌드"
- 새로운 분석/자문/로드맵 문서를 아카이브에 등록할 때

## 모드

### Save 모드 (문서 → 아카이브 등록)
1. 대상 문서에서 메타데이터 추출 (제목, 날짜, 타입, 태그 등)
2. frontmatter YAML 작성 (references/archive-entry-template.md 참조)
3. `src/content/archive/documents/{type}/{year}/{date}-{slug}.md` 경로에 파일 생성
4. `node scripts/rebuild-index.mjs` 실행하여 index/tags JSON 재생성
5. `npm run build` 로 빌드 확인 (SSG 페이지 생성 검증)
6. git commit + push

### Load 모드 (아카이브 → 컨텍스트 로드)
1. `src/content/archive/index.generated.json` 읽기
2. 요청에 맞는 문서 필터링 (타입, 태그, 기간 등)
3. 해당 md 파일 본문 읽어서 컨텍스트에 주입

## 문서 타입 (type)
| type | 한글 | 설명 |
|------|------|------|
| roadmap | 로드맵 | 월별 전략 로드맵 (canonical 최신본) |
| roadmap-history | 로드맵 이력 | 로드맵 과거 버전 |
| codex-prompt | 코덱스 프롬프트 | Codex에 보낸 검토 요청 원문 |
| codex-review | 코덱스 자문 | Codex 자문 응답 결과 |
| data-analysis | 데이터 분석 | 갭분석, KPI 분석 등 |
| audit | 감사 | 시스템/프로세스 감사 |
| sop | SOP | 운영 절차서 |
| legacy-snapshot | 레거시 | 이관 전 원본 스냅샷 |

## 디렉토리 구조
```
src/content/archive/
  documents/{type}/{year}/{date}-{slug}.md   ← 개별 문서 (frontmatter 포함)
  legacy/{year}/{date}-{slug}.md             ← 이관 전 원본
  index.generated.json                       ← 자동 생성 인덱스
  tags.generated.json                        ← 자동 생성 태그맵
scripts/
  rebuild-index.mjs                          ← 인덱스 재생성 스크립트
```

## Frontmatter 필수 필드
- `id`: 고유 식별자 (예: `codex-review-2026-04-07-01-ai-product-strategy`)
- `title`: 문서 제목 (한글)
- `date`: ISO 날짜 (YYYY-MM-DD)
- `type`: 위 타입 중 하나
- `artifact_kind`: report | prompt | sop | snapshot
- `status`: draft | final
- `version`: v1, v2, ...
- `canonical`: true (최신본) | false
- `tags`: 접두사 배열 (topic/, metric/, method/, period/, artifact/)
- `summary_line`: 1줄 요약
- `key_findings`: 핵심 발견 배열 (3개 이내)
- `related_ids`: 관련 문서 id 배열
- `token_hint`: small (<2K) | medium (2-8K) | large (8K+)

상세 스키마는 `references/archive-schema.md`, 템플릿은 `references/archive-entry-template.md` 참조.

## 주의사항
- `index.generated.json`과 `tags.generated.json`은 직접 수정하지 않는다. 반드시 `rebuild-index.mjs`로 재생성한다.
- 문서 id는 전체 아카이브에서 유일해야 한다.
- canonical: true는 같은 주제의 최신 버전 하나에만 부여한다.
- frontmatter의 path 필드는 인덱스 생성 시 자동 계산되므로 md 파일에 넣지 않는다.
