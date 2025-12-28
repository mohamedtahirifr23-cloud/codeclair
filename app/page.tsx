"use client";

import { useMemo, useState } from "react";
import { findCode, suggestCodes } from "@/lib/search";

export default function HomePage() {
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState("");

  // Form "code manquant"
  const [missEmail, setMissEmail] = useState("");
  const [missNote, setMissNote] = useState("");
  const [missStatus, setMissStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const suggestions = useMemo(() => suggestCodes(q), [q]);
  const result = useMemo(() => (submitted ? findCode(submitted) : null), [submitted]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(q);
    setMissStatus("idle");
  }

  function fillSuggestion(s: string) {
    setQ(s);
    setSubmitted(s);
    setMissStatus("idle");
  }

  async function submitMissingCode() {
    try {
      setMissStatus("sending");

      const res = await fetch("/api/missing-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: submitted,
          email: missEmail,
          note: missNote
        })
      });

      if (!res.ok) throw new Error("Request failed");

      setMissStatus("sent");
      setMissEmail("");
      setMissNote("");
    } catch {
      setMissStatus("error");
    }
  }

  return (
    <main className="container">
      <div className="card">
        <h1>Comprendre les codes sur les produits</h1>
        <p>
          Entrez un code présent sur un produit (ex : <b>PAP 21</b>, <b>PET 1</b>, <b>12M</b>, <b>LOT</b>) et
          obtenez une explication claire.
        </p>

        {/* FORM RECHERCHE */}
        <form onSubmit={onSubmit} className="row">
          <input
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Entrez le code présent sur l’emballage…"
            aria-label="Code"
          />
          <button className="btn" type="submit">
            Expliquer
          </button>
        </form>

        {/* SUGGESTIONS */}
        {suggestions.length > 0 && (
          <div className="suggestions" aria-label="Suggestions">
            {suggestions.map((s) => (
              <button key={s} className="chip" type="button" onClick={() => fillSuggestion(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* RESULTAT */}
        {submitted && (
          <div style={{ marginTop: 16 }}>
            {result ? (
              <>
                <div className="badge">
                  {result.category} • Code : {submitted}
                </div>

                {/* LINK PAGINA SEO */}
                <div style={{ marginTop: 10 }}>
                  <a className="btn" href={`/code/${result.id}`}>
                    Voir la page dédiée
                  </a>
                </div>

                <div className="grid" style={{ marginTop: 14 }}>
                  <div className="block">
                    <div className="label">Signification</div>
                    <div className="small">{result.title_fr}</div>
                    <div style={{ marginTop: 8 }}>{result.meaning_fr}</div>
                  </div>

                  <div className="block">
                    <div className="label">Que faire ?</div>
                    <div style={{ marginTop: 8 }}>{result.action_fr}</div>
                  </div>

                  <div className="block">
                    <div className="label">Attention</div>
                    <div style={{ marginTop: 8 }}>{result.warning_fr}</div>
                  </div>

                  <div className="block">
                    <div className="label">Conseil pratique</div>
                    <div style={{ marginTop: 8 }}>{result.tip_fr}</div>
                  </div>
                </div>
              </>
            ) : (
              // CODE NON TROUVÉ + FORM INVIO
              <div className="block">
                <div className="label">Code non trouvé</div>

                <div className="small" style={{ marginTop: 6 }}>
                  Essayez une autre écriture (ex : « PAP 21 », « PET 1 », « 12M »).  
                  Sinon, envoyez ce code pour l’ajouter à la base.
                </div>

                <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                  <input className="input" value={submitted} readOnly aria-label="Code manquant" />

                  <input
                    className="input"
                    value={missEmail}
                    onChange={(e) => setMissEmail(e.target.value)}
                    placeholder="Votre email (optionnel)"
                    aria-label="Email"
                  />

                  <textarea
                    className="input"
                    style={{ minHeight: 90, resize: "vertical" }}
                    value={missNote}
                    onChange={(e) => setMissNote(e.target.value)}
                    placeholder="Description (optionnel) : produit, marque, où l’avez-vous vu ?"
                    aria-label="Description"
                  />

                  <button
                    className="btn"
                    type="button"
                    onClick={submitMissingCode}
                    disabled={missStatus === "sending"}
                  >
                    {missStatus === "sending" ? "Envoi…" : "Envoyer"}
                  </button>

                  {missStatus === "sent" && (
                    <div className="small">✅ Merci ! Votre demande a été enregistrée.</div>
                  )}
                  {missStatus === "error" && (
                    <div className="small">❌ Erreur. Réessayez plus tard.</div>
                  )}
                </div>
              </div>
            )}

            <div className="footer">
              MVP • Base locale • Les codes envoyés servent à améliorer le service
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
