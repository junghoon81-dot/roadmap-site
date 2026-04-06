/**
 * Heading ID 생성 유틸 — MarkdownRenderer와 TableOfContents가 동일 로직 사용.
 * 중복 ID 발생 시 -1, -2, ... suffix 추가.
 */

export function generateHeadingId(text: string, usedIds: Set<string>): string {
  let base = text
    .toLowerCase()
    .replace(/[^\w\s가-힣-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80);

  if (!base) base = 'heading';

  let id = base;
  let counter = 1;
  while (usedIds.has(id)) {
    id = `${base}-${counter}`;
    counter++;
  }
  usedIds.add(id);
  return id;
}

/**
 * Markdown 원문에서 heading 텍스트 정규화.
 * 볼드(**), 인라인코드(`), 링크([text](url)) 제거.
 */
export function normalizeHeadingText(raw: string): string {
  return raw
    .replace(/\*\*/g, '')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .trim();
}
