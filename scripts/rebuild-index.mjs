#!/usr/bin/env node
// rebuild-index.mjs — frontmatter에서 인덱스 생성

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARCHIVE_DIR = path.join(__dirname, '..', 'src', 'content', 'archive');
const DOCS_DIR = path.join(ARCHIVE_DIR, 'documents');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  let currentKey = null;
  let currentArray = null;

  for (const line of match[1].split('\n')) {
    // Key with no value (array header like "tags:")
    const keyOnlyMatch = line.match(/^(\w[\w_]*)\s*:\s*$/);
    // Key with value
    const kvMatch = line.match(/^(\w[\w_]*)\s*:\s*(.+)$/);
    // Array item
    const arrayItemMatch = line.match(/^\s+-\s+(.+)$/);

    if (keyOnlyMatch) {
      // Save previous array if any
      if (currentKey && currentArray) fm[currentKey] = currentArray;
      currentKey = keyOnlyMatch[1];
      currentArray = [];
    } else if (kvMatch) {
      if (currentKey && currentArray) fm[currentKey] = currentArray;
      currentKey = kvMatch[1];
      let val = kvMatch[2].trim();
      if (val === '[]') {
        currentArray = [];
      } else {
        currentArray = null;
        val = val.replace(/^["']|["']$/g, '');
        if (val === 'true') val = true;
        else if (val === 'false') val = false;
        fm[currentKey] = val;
      }
    } else if (arrayItemMatch && currentKey) {
      if (!currentArray) currentArray = [];
      let val = arrayItemMatch[1].trim().replace(/^["']|["']$/g, '');
      currentArray.push(val);
    }
  }
  if (currentKey && currentArray) fm[currentKey] = currentArray;
  return fm;
}

function walkDocs(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDocs(fullPath));
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walkDocs(DOCS_DIR);
const index = [];
const tagsMap = {};

for (const filePath of files) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fm = parseFrontmatter(content);
  if (!fm || !fm.id) {
    console.warn(`⚠️  Skipping (no frontmatter/id): ${filePath}`);
    continue;
  }

  const relPath = 'src/content/archive/' + path.relative(ARCHIVE_DIR, filePath);

  const entry = {
    id: fm.id,
    title: fm.title || '(untitled)',
    date: fm.date || '2026-01-01',
    type: fm.type || 'unknown',
    artifact_kind: fm.artifact_kind || '',
    status: fm.status || 'final',
    version: fm.version || 'v1',
    canonical: fm.canonical === true || fm.canonical === 'true',
    period: fm.period || 'cross',
    tags: fm.tags || [],
    summary_line: fm.summary_line || '',
    key_findings: fm.key_findings || [],
    related_ids: fm.related_ids || [],
    path: relPath,
    token_hint: fm.token_hint || 'medium',
  };

  index.push(entry);

  for (const tag of entry.tags) {
    if (!tagsMap[tag]) tagsMap[tag] = [];
    tagsMap[tag].push(entry.id);
  }
}

index.sort((a, b) => b.date.localeCompare(a.date));

const indexPath = path.join(ARCHIVE_DIR, 'index.generated.json');
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf-8');
console.log(`✅ index.generated.json: ${index.length}개 문서`);

const tagsPath = path.join(ARCHIVE_DIR, 'tags.generated.json');
const sortedTags = Object.fromEntries(
  Object.entries(tagsMap).sort(([a], [b]) => a.localeCompare(b))
);
fs.writeFileSync(tagsPath, JSON.stringify(sortedTags, null, 2), 'utf-8');
console.log(`✅ tags.generated.json: ${Object.keys(sortedTags).length}개 태그`);

const types = {};
for (const e of index) types[e.type] = (types[e.type] || 0) + 1;
console.log('\n타입별 문서 수:');
for (const [t, c] of Object.entries(types).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${t}: ${c}개`);
}
