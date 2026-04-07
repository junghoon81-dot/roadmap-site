# 전략 아카이브 동기화 스킬

## 트리거
- "아카이브에 저장해", "전략 아카이브 업데이트해", "아카이브 추가해"
- "인덱스 재생성해", "아카이브 인덱스 리빌드"

---

## Save 모드 (문서 → 아카이브 등록)

### 절차 (10단계)
1. **id 검색**: `index.generated.json`에서 동일/유사 id 확인 → 신규 생성 vs 기존 업데이트 결정
2. **frontmatter 작성**: `references/archive-entry-template.md` 참조. 필수 필드 전부 채움
3. **스키마 검증**: type, artifact_kind, status, token_hint는 enum 값만 허용. tags는 유효 접두사만
4. **series_id 결정**: 기존 시리즈에 속하면 동일 series_id. 독립 문서면 `standalone`
5. **canonical 확인**: 같은 series_id 내에서 canonical:true는 최대 1개
6. **파일 생성**: `src/content/archive/documents/{type}/{year}/{date}-{slug}.md` (디렉토리 없으면 생성)
7. **인덱스 재생성**: `node scripts/rebuild-index.mjs` — 에러 시 즉시 중단
8. **빌드 확인**: `npm run build` — 에러 시 즉시 중단
9. **diff 확인**: `git diff --stat`으로 변경 범위 확인. 예상 외 파일 변경 시 대표님께 보고
10. **커밋**: `git commit` (push는 대표님 명시 지시가 있을 때만)

### 금지 사항
- **direct push 금지**: commit까지만 자동. push는 대표님 지시 시에만
- **기존 문서 덮어쓰기 금지**: update 시 대표님 확인 후 진행
- **검증 생략 금지**: rebuild-index 에러 또는 빌드 실패 시 커밋하지 않음

### enum 허용값
- **type**: roadmap, roadmap-history, codex-prompt, codex-review, data-analysis, audit, sop, legacy-snapshot
- **artifact_kind**: report, prompt, sop, snapshot, review
- **status**: draft, final
- **token_hint**: small (<2K토큰), medium (2-8K), large (8K+)
- **tag 접두사**: topic/, metric/, method/, period/, artifact/

---

## Load 모드 (아카이브 → 컨텍스트 로드)

### 절차
1. `index.generated.json` 읽기
2. 요청에 맞는 문서 필터링 (type, tags, period, series_id 등)
3. **토큰 예산 관리**:
   - 단일 문서 요청: 전문 로드
   - 복수 문서 요청: summary_line + key_findings 먼저 제공
   - 대표님이 특정 문서 전문을 요청하면 그때 로드
4. token_hint 기준 예산 계산: small=2K, medium=5K, large=10K
5. 총 예산 상한: 20K 토큰 (초과 시 대표님께 어떤 문서를 우선할지 확인)

### 로드 우선순위
1. canonical: true 문서 우선
2. 최신 date 우선
3. 요청 태그와 일치도 높은 순

---

## 디렉토리 구조
```
src/content/archive/
  documents/{type}/{year}/{date}-{slug}.md   ← 개별 문서 (frontmatter 포함)
  legacy/{year}/{date}-{slug}.md             ← 이관 전 원본
  index.generated.json                       ← 자동 생성 (rebuild-index.mjs)
  tags.generated.json                        ← 자동 생성 (rebuild-index.mjs)
scripts/
  rebuild-index.mjs                          ← gray-matter 기반 인덱스 + 검증
```

## 인덱스 자동 기능 (rebuild-index.mjs)
- gray-matter로 YAML frontmatter 파싱
- 스키마 검증: 필수 필드, enum, tag 접두사, date 형식
- id 중복 검사 (중복 시 exit 1)
- related_ids 깨진 참조 검사 (존재하지 않는 id 시 exit 1)
- **backlinks 자동 생성**: A→B이면 B→A도 자동 추가
- 정렬: date desc, 같은 날짜는 id asc

## 주의사항
- `index.generated.json`과 `tags.generated.json`은 직접 수정 금지. `rebuild-index.mjs`로만 재생성
- 문서 id는 전체 아카이브에서 유일해야 함
- canonical: true는 같은 series_id 내 최신 버전 하나에만 부여
- frontmatter의 path 필드는 인덱스 생성 시 자동 계산되므로 md 파일에 넣지 않음
- `npm run build` 시 prebuild 훅으로 `rebuild-index.mjs`가 자동 실행됨

상세 스키마: `references/archive-schema.md`
템플릿: `references/archive-entry-template.md`
