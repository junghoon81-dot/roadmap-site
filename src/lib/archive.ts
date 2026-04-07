import fs from 'fs';
import path from 'path';

export interface ArchiveEntry {
  id: string;
  title: string;
  date: string;
  type: string;
  artifact_kind: string;
  status: string;
  version: string;
  canonical: boolean;
  period: string;
  tags: string[];
  summary_line: string;
  key_findings: string[];
  related_ids: string[];
  path: string;
  token_hint: string;
}

const ARCHIVE_DIR = path.join(process.cwd(), 'src', 'content', 'archive');

export function getArchiveIndex(): ArchiveEntry[] {
  const indexPath = path.join(ARCHIVE_DIR, 'index.generated.json');
  if (!fs.existsSync(indexPath)) return [];
  const raw = fs.readFileSync(indexPath, 'utf-8');
  return JSON.parse(raw) as ArchiveEntry[];
}

export function getArchiveDoc(id: string): { meta: ArchiveEntry; content: string } | null {
  const index = getArchiveIndex();
  const meta = index.find((e) => e.id === id);
  if (!meta) return null;

  const filePath = path.join(process.cwd(), meta.path);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  // Strip frontmatter
  const content = raw.replace(/^---[\s\S]*?---\n*/, '');
  return { meta, content };
}

export function getArchiveTags(): Record<string, string[]> {
  const tagsPath = path.join(ARCHIVE_DIR, 'tags.generated.json');
  if (!fs.existsSync(tagsPath)) return {};
  const raw = fs.readFileSync(tagsPath, 'utf-8');
  return JSON.parse(raw);
}

const TYPE_LABELS: Record<string, string> = {
  'roadmap': '로드맵',
  'roadmap-history': '로드맵 이력',
  'codex-prompt': '코덱스 프롬프트',
  'codex-review': '코덱스 자문',
  'data-analysis': '데이터 분석',
  'audit': '감사',
  'sop': 'SOP',
  'legacy-snapshot': '레거시',
};

export function getTypeLabel(type: string): string {
  return TYPE_LABELS[type] || type;
}

const TYPE_COLORS: Record<string, string> = {
  'roadmap': 'bg-blue-50 text-blue-700',
  'codex-prompt': 'bg-purple-50 text-purple-700',
  'codex-review': 'bg-green-50 text-green-700',
  'data-analysis': 'bg-orange-50 text-orange-700',
  'audit': 'bg-red-50 text-red-700',
  'sop': 'bg-gray-100 text-gray-700',
};

export function getTypeColor(type: string): string {
  return TYPE_COLORS[type] || 'bg-gray-100 text-gray-600';
}
