#!/usr/bin/env node
// rebuild-index.mjs — gray-matter 기반 인덱스 생성 + 스키마 검증
// 2026-04-07 코덱스 감사 결과 반영: 커스텀 파서 교체, 검증 추가

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARCHIVE_DIR = path.join(__dirname, '..', 'src', 'content', 'archive');
const DOCS_DIR = path.join(ARCHIVE_DIR, 'documents');

// ── 스키마 정의 ──
const VALID_TYPES = [
  'roadmap', 'roadmap-history', 'codex-prompt', 'codex-review',
  'data-analysis', 'audit', 'sop', 'legacy-snapshot',
  'session-digest', 'facts'
];
const VALID_ARTIFACT_KINDS = ['report', 'prompt', 'sop', 'snapshot', 'review', 'digest', 'fact-registry'];
const VALID_STATUSES = ['draft', 'final'];
const VALID_TOKEN_HINTS = ['small', 'medium', 'large'];
const VALID_TAG_PREFIXES = ['topic/', 'metric/', 'method/', 'period/', 'artifact/'];
const VALID_DOCUMENT_INTENTS = ['proposal', 'analysis', 'session-record', 'fact-registry', ''];
const VALID_AUTHORITIES = ['proposed', 'evidence-backed', 'owner-confirmed', 'mixed', ''];

// ── 검증 함수 ──
const errors = [];
const warnings = [];

function fail(file, msg) { errors.push(`❌ ${path.basename(file)}: ${msg}`); }
function warn(file, msg) { warnings.push(`⚠️  ${path.basename(file)}: ${msg}`); }

function validateEntry(fm, filePath, allIds) {
  // 필수 필드
  const required = ['id', 'title', 'date', 'type', 'artifact_kind', 'status', 'version', 'tags', 'summary_line', 'key_findings'];
  for (const field of required) {
    if (fm[field] === undefined || fm[field] === null || fm[field] === '') {
      fail(filePath, `필수 필드 "${field}" 누락`);
    }
  }

  // id 중복
  if (fm.id && allIds.has(fm.id)) {
    fail(filePath, `중복 id: "${fm.id}"`);
  }

  // enum 검증
  if (fm.type && !VALID_TYPES.includes(fm.type)) {
    fail(filePath, `잘못된 type: "${fm.type}" (허용: ${VALID_TYPES.join(', ')})`);
  }
  if (fm.artifact_kind && !VALID_ARTIFACT_KINDS.includes(fm.artifact_kind)) {
    fail(filePath, `잘못된 artifact_kind: "${fm.artifact_kind}" (허용: ${VALID_ARTIFACT_KINDS.join(', ')})`);
  }
  if (fm.status && !VALID_STATUSES.includes(fm.status)) {
    fail(filePath, `잘못된 status: "${fm.status}"`);
  }
  if (fm.token_hint && !VALID_TOKEN_HINTS.includes(fm.token_hint)) {
    fail(filePath, `잘못된 token_hint: "${fm.token_hint}"`);
  }

  // 태그 접두사 검증
  if (Array.isArray(fm.tags)) {
    for (const tag of fm.tags) {
      if (!VALID_TAG_PREFIXES.some(p => tag.startsWith(p))) {
        warn(filePath, `태그 "${tag}"에 유효한 접두사 없음 (허용: ${VALID_TAG_PREFIXES.join(', ')})`);
      }
    }
  }

  // date 형식 검증
  if (fm.date && !/^\d{4}-\d{2}-\d{2}$/.test(String(fm.date))) {
    // gray-matter가 Date 객체로 파싱할 수 있으므로 문자열 변환 후 확인
    const dateStr = fm.date instanceof Date
      ? fm.date.toISOString().split('T')[0]
      : String(fm.date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      fail(filePath, `잘못된 date 형식: "${fm.date}" (YYYY-MM-DD 필요)`);
    }
  }

  // canonical은 boolean이어야 함
  if (fm.canonical !== undefined && typeof fm.canonical !== 'boolean') {
    warn(filePath, `canonical이 boolean이 아닙니다: "${fm.canonical}" (${typeof fm.canonical})`);
  }

  // document_intent 검증
  if (fm.document_intent && !VALID_DOCUMENT_INTENTS.includes(fm.document_intent)) {
    fail(filePath, `잘못된 document_intent: "${fm.document_intent}" (허용: ${VALID_DOCUMENT_INTENTS.filter(Boolean).join(', ')})`);
  }

  // default_authority 검증
  if (fm.default_authority && !VALID_AUTHORITIES.includes(fm.default_authority)) {
    fail(filePath, `잘못된 default_authority: "${fm.default_authority}" (허용: ${VALID_AUTHORITIES.filter(Boolean).join(', ')})`);
  }

  // corrects_ids 배열 검증
  if (fm.corrects_ids && !Array.isArray(fm.corrects_ids)) {
    fail(filePath, `corrects_ids가 배열이 아닙니다`);
  }
}

// ── 파일 탐색 ──
function walkDocs(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDocs(fullPath));
    else if (entry.name.endsWith('.md')) results.push(fullPath);
  }
  return results;
}

// ── 메인 처리 ──
const files = walkDocs(DOCS_DIR);
const index = [];
const tagsMap = {};
const allIds = new Set();

for (const filePath of files) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  let parsed;
  try {
    parsed = matter(raw);
  } catch (e) {
    fail(filePath, `frontmatter 파싱 실패: ${e.message}`);
    continue;
  }

  const fm = parsed.data;
  if (!fm || !fm.id) {
    fail(filePath, 'id가 없습니다');
    continue;
  }

  // 검증
  validateEntry(fm, filePath, allIds);
  allIds.add(fm.id);

  // date 정규화 (gray-matter가 Date 객체로 변환할 수 있음)
  let dateStr = fm.date;
  if (fm.date instanceof Date) {
    dateStr = fm.date.toISOString().split('T')[0];
  } else {
    dateStr = String(fm.date || '2026-01-01');
  }

  const relPath = 'src/content/archive/' + path.relative(ARCHIVE_DIR, filePath);

  const entry = {
    id: fm.id,
    title: fm.title || '(untitled)',
    date: dateStr,
    type: fm.type || 'unknown',
    artifact_kind: fm.artifact_kind || '',
    status: fm.status || 'final',
    version: fm.version || 'v1',
    canonical: fm.canonical === true,
    period: fm.period || '',
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    summary_line: fm.summary_line || '',
    key_findings: Array.isArray(fm.key_findings) ? fm.key_findings : [],
    related_ids: Array.isArray(fm.related_ids) ? fm.related_ids : [],
    corrects_ids: Array.isArray(fm.corrects_ids) ? fm.corrects_ids : [],
    corrected_by_ids: [],  // 자동 생성 (corrects_ids 역참조)
    series_id: fm.series_id || '',
    source_session_id: fm.source_session_id || '',
    document_intent: fm.document_intent || '',
    default_authority: fm.default_authority || '',
    path: relPath,
    token_hint: fm.token_hint || 'medium',
  };

  index.push(entry);
  for (const tag of entry.tags) {
    if (!tagsMap[tag]) tagsMap[tag] = [];
    tagsMap[tag].push(entry.id);
  }
}

// ── related_ids 정합성 검사 + backlinks 자동 생성 ──
const allIdSet = new Set(index.map(e => e.id));
let brokenRefs = 0;
let asymmetricFixed = 0;

for (const entry of index) {
  for (const rid of entry.related_ids) {
    if (!allIdSet.has(rid)) {
      fail(`(index)`, `"${entry.id}" → 존재하지 않는 related_id: "${rid}"`);
      brokenRefs++;
    }
  }
}

// backlinks 자동 생성: A→B이면 B→A도 추가
for (const entry of index) {
  for (const rid of entry.related_ids) {
    const target = index.find(e => e.id === rid);
    if (target && !target.related_ids.includes(entry.id)) {
      target.related_ids.push(entry.id);
      asymmetricFixed++;
    }
  }
}

// corrects_ids → corrected_by_ids 역참조 자동 생성
let correctionsLinked = 0;
for (const entry of index) {
  for (const cid of entry.corrects_ids) {
    if (!allIdSet.has(cid)) {
      fail(`(index)`, `"${entry.id}" → corrects 존재하지 않는 id: "${cid}"`);
      continue;
    }
    const target = index.find(e => e.id === cid);
    if (target && !target.corrected_by_ids.includes(entry.id)) {
      target.corrected_by_ids.push(entry.id);
      correctionsLinked++;
    }
  }
}

// ── 정렬 (date desc, 같은 날짜는 id asc) ──
index.sort((a, b) => {
  const d = b.date.localeCompare(a.date);
  return d !== 0 ? d : a.id.localeCompare(b.id);
});

// ── 결과 저장 ──
const indexPath = path.join(ARCHIVE_DIR, 'index.generated.json');
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf-8');

const sortedTags = Object.fromEntries(
  Object.entries(tagsMap).sort(([a], [b]) => a.localeCompare(b))
);
const tagsPath = path.join(ARCHIVE_DIR, 'tags.generated.json');
fs.writeFileSync(tagsPath, JSON.stringify(sortedTags, null, 2), 'utf-8');

// ── 리포트 ──
console.log(`\n✅ index.generated.json: ${index.length}개 문서`);
console.log(`✅ tags.generated.json: ${Object.keys(sortedTags).length}개 태그`);

const types = {};
for (const e of index) types[e.type] = (types[e.type] || 0) + 1;
console.log('\n타입별 문서 수:');
for (const [t, c] of Object.entries(types).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${t}: ${c}개`);
}

// canonical 통계
const canonicalCount = index.filter(e => e.canonical).length;
console.log(`\ncanonical: ${canonicalCount}개 true, ${index.length - canonicalCount}개 false`);

// backlinks 자동 생성 리포트
if (asymmetricFixed > 0) {
  console.log(`\n🔗 backlinks 자동 생성: ${asymmetricFixed}건 (비대칭 → 양방향으로 보완)`);
}

// corrections 역참조 리포트
if (correctionsLinked > 0) {
  console.log(`🔧 corrections 역참조 생성: ${correctionsLinked}건 (corrects → corrected_by 자동 연결)`);
}

// 경고 출력
if (warnings.length > 0) {
  console.log(`\n⚠️  경고 ${warnings.length}건:`);
  for (const w of warnings) console.log(`  ${w}`);
}

// 에러 출력 + exit code
if (errors.length > 0) {
  console.error(`\n❌ 에러 ${errors.length}건:`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

console.log('\n✅ 검증 통과 — 에러 0건');
