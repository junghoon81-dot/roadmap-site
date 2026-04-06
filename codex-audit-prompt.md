# 로드맵 사이트 3월/4월 추가 — 전수 감사 프롬프트

## 배경

커밋 `b468fb5`에서 김과외 로드맵 사이트에 3월/4월 로드맵을 추가했다.
아래 체크리스트를 **전부** 검증하고, 각 항목마다 ✅ PASS / ❌ FAIL + 사유를 기록하라.
FAIL이 1건이라도 있으면 마지막에 수정 방안을 구체적으로 제시하라.

---

## 1. 타입 시스템 (`src/lib/types.ts`)

- [ ] `RoadmapPeriod` 유니온에 `'mar' | 'apr'`이 포함되어 있는가?
- [ ] `PERIOD_LABELS`에 `mar: '3월 로드맵'`, `apr: '4월 로드맵'` 엔트리가 있는가?
- [ ] `PERIOD_DATES`에 `mar: '3월'`, `apr: '4월'` 엔트리가 있는가?
- [ ] 기존 `may`, `jun` 엔트리가 그대로 보존되어 있는가? (regression 체크)

## 2. 메타데이터 (`src/lib/docs.ts`)

- [ ] `FILE_MAP`에 `mar: '3월_로드맵.md'`, `apr: '4월_로드맵.md'` 매핑이 있는가?
- [ ] `TITLES`에 mar/apr 엔트리가 있고, 내용이 각 마크다운 실제 주제와 일치하는가?
- [ ] `SUBTITLES`에 mar/apr 엔트리가 있는가?
- [ ] `DESCRIPTIONS`에 mar/apr 엔트리가 있고, 마크다운 내용을 정확히 요약하는가?
- [ ] 기존 may/jun 엔트리가 변경 없이 보존되어 있는가?
- [ ] 모든 `Record<RoadmapPeriod, string>` 타입에서 mar/apr 키가 빠진 곳이 없는가? (TypeScript 컴파일 에러 여부로 확인 가능)

## 3. 마크다운 콘텐츠 — 3월 (`src/content/mar/3월_로드맵.md`)

**소스: Notion "26년 4월 패치노트" (실제 3월 스코프, 4/13 배포 완료)**

- [ ] 파일이 존재하고 비어있지 않은가?
- [ ] 다음 핵심 주제가 모두 포함되어 있는가:
  - 공고 개편 (경쟁강도 도입)
  - 소개서 구조화 (수업 요일/시간대, 수업 목적, 자신있는 파트 신규 항목)
  - AI 자연어 검색
  - 수업료 납부 요청서 자동발송
  - 현금영수증 자동발급
  - 학원법 개정 대응
- [ ] "준비중", "coming soon", placeholder, TODO 등 미완성 마커가 없는가?
- [ ] `[검토N 반영]` 태그가 없는가?
- [ ] `~~취소선~~` 텍스트가 없는가?

## 4. 마크다운 콘텐츠 — 4월 (`src/content/apr/4월_로드맵.md`)

**소스: 5월 로드맵 §3-2 "Phase 0" — 현욱님 기획 3개 파트**

- [ ] 파일이 존재하고 비어있지 않은가?
- [ ] 다음 핵심 주제가 모두 포함되어 있는가:
  - 매출 향상 포인트 8개 (A~H): 성사 누락, 시범→정규 전환, FOMO, 리뷰, 이탈 복구, 부스트, 휴면, 설문
  - SEO 프로그래매틱 랜딩 (10만 페이지)
  - 선생님 편의성 강화
- [ ] 8개 매출 향상 포인트가 A~H로 구분되어 표 또는 목록으로 정리되어 있는가?
- [ ] "준비중", "coming soon", placeholder, TODO 등 미완성 마커가 없는가?
- [ ] `[검토N 반영]` 태그가 없는가?
- [ ] `~~취소선~~` 텍스트가 없는가?
- [ ] 5월 로드맵과의 연결(Phase 0 → Phase 1 흐름)이 언급되어 있는가?

## 5. 페이지 라우트

- [ ] `src/app/roadmap/mar/page.tsx` 파일이 존재하는가?
- [ ] `src/app/roadmap/apr/page.tsx` 파일이 존재하는가?
- [ ] mar/page.tsx에서 `getDocContent('mar')`, `getDocMeta('mar')`를 호출하는가?
- [ ] apr/page.tsx에서 `getDocContent('apr')`, `getDocMeta('apr')`를 호출하는가?
- [ ] 두 파일 모두 `RoadmapViewer` 컴포넌트를 사용하는가?
- [ ] `export const metadata`에 적절한 title이 설정되어 있는가?
- [ ] 기존 may/page.tsx, jun/page.tsx가 변경 없이 보존되어 있는가?

## 6. 홈 페이지 (`src/app/page.tsx`)

- [ ] cards 배열에 4개 항목이 있는가? (mar → apr → may → jun 순서)
- [ ] mar 카드: icon 있음, status 있음, href `/roadmap/mar`
- [ ] apr 카드: icon 있음, status 있음, href `/roadmap/apr`
- [ ] 기존 may/jun 카드가 변경 없이 보존되어 있는가?
- [ ] 히어로 텍스트가 "3월~6월"로 변경되어 있는가? ("5월~6월" 잔존 여부 확인)
- [ ] 그리드 레이아웃이 4개 카드를 적절히 표시하는가? (lg:grid-cols-4 또는 유사)
- [ ] 타임라인 섹션이 4개 period를 모두 표시하는가?

## 7. 빌드 검증

아래 명령을 실행하고 결과를 기록하라:

```bash
cd /Users/lilith/roadmap-site && npm run build 2>&1
```

- [ ] TypeScript 컴파일 에러 0건
- [ ] 빌드 성공
- [ ] 출력에 `/roadmap/mar`, `/roadmap/apr`, `/roadmap/may`, `/roadmap/jun`, `/` 5개 라우트가 모두 표시되는가?

## 8. 콘텐츠 정합성 교차 검증

- [ ] docs.ts의 `TITLES['mar']`와 3월_로드맵.md의 실제 제목/주제가 일치하는가?
- [ ] docs.ts의 `TITLES['apr']`와 4월_로드맵.md의 실제 제목/주제가 일치하는가?
- [ ] docs.ts의 `DESCRIPTIONS['mar']`가 3월_로드맵.md 내용을 정확히 요약하는가?
- [ ] docs.ts의 `DESCRIPTIONS['apr']`가 4월_로드맵.md 내용을 정확히 요약하는가?
- [ ] 5월_로드맵.md의 §3-2 Phase 0 내용이 4월_로드맵.md로 적절히 분리되었는가? (중복이 아닌 참조/연결 형태)

---

## 결과 요약 양식

| 섹션 | 항목 수 | PASS | FAIL | 비고 |
|------|---------|------|------|------|
| 1. 타입 시스템 | 4 | | | |
| 2. 메타데이터 | 6 | | | |
| 3. 3월 콘텐츠 | 5 | | | |
| 4. 4월 콘텐츠 | 7 | | | |
| 5. 페이지 라우트 | 7 | | | |
| 6. 홈 페이지 | 7 | | | |
| 7. 빌드 검증 | 3 | | | |
| 8. 교차 검증 | 5 | | | |
| **합계** | **44** | | | |

**최종 판정:** 44/44 PASS 시 "전수 감사 통과". 1건이라도 FAIL 시 수정 방안 제시.
