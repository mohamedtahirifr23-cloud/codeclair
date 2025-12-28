"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DB_RAW from "../data/codes_250_fr.json";

type CodeEntry = {
  id: string;
  codes: string[];
  category: string;
  title_fr: string;
  meaning_fr: string;
  action_fr: string;
  warning_fr?: string;
  tip_fr?: string;
};

const DB = DB_RAW as CodeEntry[];

function normalizeForMatch(s: string) {
  // Normalizza per confrontare: "PAP 20" == "PAP20" == "PAP-20"
  return (s || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "") // remove spaces
    .replace(/[-_.]/g, ""); // remove - _ .
}

function normalizeDisplay(s: string) {
  return (s || "").trim().toUpperCase().replace(/\s+/g, " ");
}

function findByInput(input: string): CodeEntry | null {
  const q = normalizeForMatch(input);
  if (!q) return null;

  for (const entry of DB) {
    for (const c of entry.codes || []) {
      if (normalizeForMatch(c) === q) return entry;
    }
  }
  return null;
}

function pickBestDisplayedCode(input: string, entry: CodeEntry): string {
  // Se l'utente scrive "PAP 20", mostriamo "PAP 20" (più naturale).
  const typed = normalizeDisplay(input);
  if (typed) return typed;

  // fallback: la prima variante
  return (entry.codes?.[0] || entry.id).toString();
}

export default function HomePage() {
  const [query, setQuery] = useState<string>("");
  const [submitted, setSubmitted] = useState<string>("");
  const [result, setResult] = useState<CodeEntry | null>(null);

  const examples = useMemo(
    () => ["PAP 20", "PAP 21", "PET 1", "HDPE 2", "PP 5", "12M", "LOT"],
    []
  );

  function runSearch(custom?: string) {
    const q = (custom ?? query).trim();
    setSubmitted(q);

    const found = findByInput(q);
    setResult(found);
  }

  const shownCode = result ? pickBestDisplayedCode(submitted, result) : "";

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "36px 16px" }}>
      <div
        style={{
          padding: 24,
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(10, 20, 35, 0.55)",
          backdropFilter: "blur(10px)",
        }}
      >
        <header style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 34, margin: 0 }}>Comprendre les codes sur les produits</h1>
            <p style={{ opacity: 0.8, marginTop: 8 }}>
              Entrez un code présent sur un produit (ex : <b>PAP 21</b>, <b>PET 1</b>, <b>12M</b>, <b>LOT</b>) et obtenez une explication claire.
            </p>
          </div>

          {/* Link verso la pagina hub SEO */}
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <Link
              href="/top-codes"
              className="btn"
              style={{
                display: "inline-block",
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.14)",
                textDecoration: "none",
                color: "inherit",
                background: "rgba(255,255,255,0.04)",
                whiteSpace: "nowrap",
              }}
            >
              Top codes
            </Link>
          </div>
        </header>

        {/* Input + bottone */}
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runSearch();
            }}
            placeholder="Ex : PAP 20, PET 1, HDPE 2, 12M, LOT…"
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.10)",
              outline: "none",
              background: "rgba(0,0,0,0.20)",
              color: "white",
            }}
          />

          <button
            type="button"
            className="btn"
            onClick={() => runSearch()}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.06)",
              color: "white",
              cursor: "pointer",
              minWidth: 110,
            }}
          >
            Expliquer
          </button>
        </div>

        {/* Esempi rapidi */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => {
                setQuery(ex);
                runSearch(ex);
              }}
              style={{
                padding: "7px 10px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.03)",
                color: "white",
                cursor: "pointer",
                opacity: 0.9,
              }}
              aria-label={`Exemple ${ex}`}
              title={`Tester ${ex}`}
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Risultato */}
        {submitted.trim().length > 0 && (
          <div style={{ marginTop: 18 }}>
            {/* pill */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span
                style={{
                  padding: "7px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                {normalizeDisplay(submitted)}
              </span>

              {result ? (
                <span style={{ opacity: 0.75 }}>
                  {result.category} · Code : <b>{shownCode}</b>
                </span>
              ) : (
                <span style={{ opacity: 0.75 }}>Aucun résultat trouvé</span>
              )}
            </div>

            {result ? (
              <>
                <div style={{ marginTop: 10 }}>
                  <Link
                    className="btn"
                    href={`/code/${result.id}`}
                    style={{
                      display: "inline-block",
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.14)",
                      textDecoration: "none",
                      color: "inherit",
                      background: "rgba(255,255,255,0.04)",
                    }}
                  >
                    Voir la page dédiée
                  </Link>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 14,
                    marginTop: 14,
                  }}
                >
                  <div
                    style={{
                      padding: 16,
                      borderRadius: 16,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(0,0,0,0.20)",
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: 18 }}>Signification</h3>
                    <div style={{ opacity: 0.75, marginTop: 6 }}>{result.title_fr}</div>
                    <div style={{ marginTop: 10 }}>{result.meaning_fr}</div>
                  </div>

                  <div
                    style={{
                      padding: 16,
                      borderRadius: 16,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(0,0,0,0.20)",
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: 18 }}>Que faire ?</h3>
                    <div style={{ marginTop: 10 }}>{result.action_fr}</div>
                  </div>

                  <div
                    style={{
                      padding: 16,
                      borderRadius: 16,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(0,0,0,0.20)",
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: 18 }}>Attention</h3>
                    <div style={{ marginTop: 10 }}>
                      {result.warning_fr?.trim()
                        ? result.warning_fr
                        : "Selon les consignes locales, certains emballages peuvent être refusés s’ils sont très sales."}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: 16,
                      borderRadius: 16,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(0,0,0,0.20)",
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: 18 }}>Conseil pratique</h3>
                    <div style={{ marginTop: 10 }}>
                      {result.tip_fr?.trim() ? result.tip_fr : "Rincez rapidement si nécessaire et compactez l’emballage pour réduire le volume."}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 14, opacity: 0.75, fontSize: 13 }}>
                  Autres écritures possibles :{" "}
                  {(result.codes || []).slice(0, 8).join(", ")}
                </div>
              </>
            ) : (
              <div style={{ marginTop: 14, opacity: 0.85 }}>
                Aucun code correspondant. Essaie une autre écriture (ex : <b>PAP20</b> au lieu de <b>PAP 20</b>) ou consulte{" "}
                <Link href="/top-codes" style={{ color: "inherit", textDecoration: "underline" }}>
                  Top codes
                </Link>
                .
              </div>
            )}
          </div>
        )}

        <footer style={{ marginTop: 18, opacity: 0.6, fontSize: 12 }}>
          MVP • Base locale • Les codes envoyés servent à améliorer le service
        </footer>
      </div>
    </main>
  );
}
