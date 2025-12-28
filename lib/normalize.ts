export function normalizeInput(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ")
    .replace(/[._]/g, " ")
    .replace(/-/g, " ")
    .trim();
}
