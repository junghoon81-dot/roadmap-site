---
name: strategy-archive-sync
description: Use when the user asks to save a strategy analysis, Codex review, audit, roadmap draft, or data analysis into the roadmap-site archive, or when a completed strategy artifact should be structured for later retrieval and context loading.
---

# Strategy Archive Sync

이 스킬은 `~/roadmap-site`의 전략 아카이브를 문서 단위로 저장하고, 인덱스를 갱신하고, 필요 시 git 반영까지 처리할 때 사용합니다.

이 스킬이 필요한 경우:

- 대표님이 "아카이브에 저장해"라고 지시한 경우
- 전략 분석, Codex 감사, 자체 데이터 분석, 로드맵 기획 버전이 방금 완성된 경우
- 다음 세션에서 재활용할 수 있도록 분석 산출물을 구조화해야 하는 경우

이 스킬이 필요 없는 경우:

- 단순 코드 수정 로그
- 실패 로그만 있는 세션
- 내용이 너무 짧아 문서 가치가 없는 메모

## 우선 원칙

1. 기존 아카이브 본문을 함부로 덮어쓰지 않습니다.
2. 문서 1개는 파일 1개로 저장합니다.
3. 저장 전에 `title`, `date`, `type`, `tags`, `summary_line`, `key_findings`를 반드시 확정합니다.
4. 같은 문서가 이미 있으면 중복 생성하지 말고 갱신 또는 새 버전 여부를 먼저 판단합니다.
5. 빌드가 실패하면 push하지 않습니다.

## 실행 순서

### 1. 저장 대상 판별

현재 산출물을 아래 타입 중 하나로 분류합니다.

- `roadmap`
- `roadmap-history`
- `codex-prompt`
- `codex-review`
- `data-analysis`
- `audit`
- `sop`

분류 기준이 모호하면 제목과 본문 목적을 보고 결정합니다.

### 2. 필요한 참고 자료 읽기

아래 참고 파일을 먼저 읽습니다.

- 구조/메타데이터 규칙: [archive-schema.md](references/archive-schema.md)
- 문서 템플릿: [archive-entry-template.md](references/archive-entry-template.md)

### 3. 메타데이터 추출

반드시 아래 값을 채웁니다.

- `id`
- `title`
- `date`
- `type`
- `version`
- `canonical`
- `tags`
- `summary_line`
- `key_findings`
- `related_ids`
- `source_paths`

추출 규칙:

- 제목: H1 우선, 없으면 파일명 정리
- 날짜: 파일명 포함 날짜 우선, 없으면 본문 명시 날짜, 둘 다 없으면 파일 수정일
- 태그: `topic/*` 2~4개, `metric/*` 0~2개, `method/*` 1개를 기본으로 구성
- 1줄 요약: 90~120자
- 핵심 결론: 정확히 3줄 우선

### 4. 저장 경로 결정

기본 경로:

```text
src/content/archive/documents/<type>/<year>/<date>-<slug>.md
```

예시:

- `src/content/archive/documents/data-analysis/2026/2026-04-07-escrow-gap-analysis.md`
- `src/content/archive/documents/codex-prompt/2026/2026-04-07-v9-1-review-02-revenue-kpi-data.md`

기존 단일 문서는 `legacy/`에만 둡니다.

### 5. 문서 작성

문서 구조는 아래 순서를 유지합니다.

1. frontmatter
2. `## 1줄 요약`
3. `## 핵심 결론`
4. `## 전문`
5. 필요 시 `## 관련 문서`

원문이 `.docx`이면 Mac 기본 도구로 텍스트를 추출한 뒤 markdown으로 정리합니다.

권장 명령:

```sh
textutil -convert txt -stdout /absolute/path/to/file.docx
```

### 6. 인덱스 갱신

문서 저장 후 아래를 갱신합니다.

- `src/content/archive/index.generated.json`
- `src/content/archive/tags.generated.json`

인덱스에는 전문을 넣지 않습니다. 요약 메타데이터만 넣습니다.

최소 포함 필드:

- `id`
- `title`
- `date`
- `type`
- `tags`
- `summary_line`
- `key_findings`
- `path`
- `canonical`
- `related_ids`

### 7. 중복/버전 처리

다음 기준으로 판단합니다.

- 제목과 날짜가 같고 내용이 소폭 수정이면 기존 문서 갱신
- 질문 구조나 결론 구조가 바뀌었으면 새 버전 생성
- 로드맵 v1~v9는 전부 보관하고, 최종본만 `canonical=true`
- legacy snapshot은 기본 목록에서 제외

### 8. 검증

반드시 아래를 확인합니다.

- 새 문서가 올바른 경로에 생성되었는가
- frontmatter 필수 필드가 모두 있는가
- 인덱스와 태그 파일이 재생성되었는가
- 같은 `id`가 중복되지 않는가
- `npm run build`가 통과하는가

### 9. git 반영

대표님이 명시적으로 요청했거나, 이 저장 작업이 아카이브 운영 루틴의 일부로 합의된 경우에만 아래를 진행합니다.

1. `git status --short`로 변경 범위 확인
2. 내 변경만 add
3. 정확한 커밋 메시지 작성
4. push
5. Vercel 자동 배포 확인

커밋 메시지 예시:

- `docs: archive escrow gap analysis`
- `docs: add codex prompt archive entries`
- `docs: migrate roadmap history archive`

## 수동 트리거

아래 문장을 들으면 이 스킬을 즉시 사용합니다.

- "아카이브에 저장해"
- "전략 아카이브 업데이트해"
- "이 분석 보관해"
- "roadmap-site 아카이브에 반영해"

## 자동 트리거

아래 조건을 모두 만족할 때만 자동 사용을 제안합니다.

1. 현재 세션 산출물이 전략 문서다
2. 제목과 결론 3줄이 명확하다
3. 같은 문서가 아직 인덱스에 없다
4. 저장 대상 레포가 확인된다

자동 트리거 시에는 바로 덮어쓰기보다 "저장 가능 상태"를 먼저 판단합니다.

## 에러 처리

- git 충돌 또는 unrelated dirty tree가 있으면 자동 커밋을 중단하고 현재 변경만 분리합니다.
- 빌드 실패 시 push하지 않고, 에러 원문과 실패 지점을 그대로 보고합니다.
- 인덱스 생성 실패 시 문서 원문은 유지하되 generated 파일은 수정하지 않습니다.
- 이미 있는 문서와 충돌하면 새 버전 생성과 기존 갱신 중 무엇이 맞는지 근거와 함께 판단합니다.

## 보고 형식

저장 작업이 끝나면 아래 형식으로 요약합니다.

- 저장한 문서 수
- 생성/갱신한 경로
- 새로 붙인 주요 태그
- 인덱스 갱신 여부
- 빌드 결과
- git 반영 여부
