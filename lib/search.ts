import codesData from "@/data/codes.json";
import { normalizeInput } from "./normalize";

export type CodeEntry = {
  id: string;
  codes: string[];
  category: string;
  title_fr: string;
  meaning_fr: string;
  action_fr: string;
  warning_fr: string;
  tip_fr: string;
};

const DB = (codesData as CodeEntry[]).map((e) => ({
  ...e,
  _normCodes: e.codes.map((c) => normalizeInput(c))
}));

export function findCode(queryRaw: string): CodeEntry | null {
  const q = normalizeInput(queryRaw);
  if (!q) return null;

  // Match exact
  const exact = DB.find((e) => e._normCodes.includes(q));
  if (exact) return stripInternal(exact);

  // Match “contains” (utile per input tipo: "PAP 21 carton")
  const contains = DB.find((e) => e._normCodes.some((c) => q.includes(c) || c.includes(q)));
  if (contains) return stripInternal(contains);

  return null;
}

function stripInternal(entry: any): CodeEntry {
  const { _normCodes, ...rest } = entry;
  return rest as CodeEntry;
}

export function suggestCodes(partialRaw: string, limit = 8): string[] {
  const p = normalizeInput(partialRaw);
  if (!p) return [];

  const all = DB.flatMap((e) => e.codes);
  const normPairs = all.map((c) => ({ orig: c, norm: normalizeInput(c) }));

  // Suggerimenti che iniziano con…
  const starts = normPairs
    .filter((x) => x.norm.startsWith(p))
    .map((x) => x.orig);

  // Se pochi, aggiungi "contiene"
  const contains = normPairs
    .filter((x) => !x.norm.startsWith(p) && x.norm.includes(p))
    .map((x) => x.orig);

  const uniq = Array.from(new Set([...starts, ...contains]));
  return uniq.slice(0, limit);
}
