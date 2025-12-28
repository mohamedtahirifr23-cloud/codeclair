import Link from "next/link";

type CodeItem = {
  id: string;
  label: string;
  category: string;
};

const TOP_CODES: { title: string; items: CodeItem[] }[] = [
  {
    title: "Papier / Carton",
    items: [
      { id: "pap-20", label: "PAP 20 — Carton ondulé", category: "Emballage / Tri" },
      { id: "pap-21", label: "PAP 21 — Carton non ondulé", category: "Emballage / Tri" },
      { id: "pap-22", label: "PAP 22 — Papier", category: "Emballage / Tri" },
    ],
  },
  {
    title: "Plastiques (résines)",
    items: [
      { id: "pet-1", label: "PET 1 — Bouteilles", category: "Plastique" },
      { id: "hdpe-2", label: "HDPE 2 — Flacons / bidons", category: "Plastique" },
      { id: "pvc-3", label: "PVC 3 — Films / tuyaux", category: "Plastique" },
      { id: "ldpe-4", label: "LDPE 4 — Sacs / films", category: "Plastique" },
      { id: "pp-5", label: "PP 5 — Pots / barquettes", category: "Plastique" },
      { id: "ps-6", label: "PS 6 — Barquettes", category: "Plastique" },
    ],
  },
  {
    title: "Verre / Métaux",
    items: [
      { id: "gl-70", label: "GL 70 — Verre", category: "Verre" },
      { id: "alu-41", label: "ALU 41 — Aluminium", category: "Métal" },
      { id: "fe-40", label: "FE 40 — Acier", category: "Métal" },
    ],
  },
  {
    title: "Cosmétiques / Dates / Lot",
    items: [
      { id: "12m", label: "12M — Période après ouverture", category: "Cosmétique" },
      { id: "24m", label: "24M — Période après ouverture", category: "Cosmétique" },
      { id: "lot", label: "LOT — Numéro de lot", category: "Traçabilité" },
      { id: "ddm", label: "DDM — Date de durabilité minimale", category: "Alimentaire" },
      { id: "dlc", label: "DLC — Date limite de consommation", category: "Alimentaire" },
    ],
  },
];

export default function TopCodesPage() {
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
        <h1 style={{ fontSize: 34, margin: 0 }}>Top codes (France)</h1>
        <p style={{ opacity: 0.8, marginTop: 8 }}>
          Liste des codes les plus courants. Cliquez pour ouvrir la page dédiée.
        </p>

        <div style={{ display: "grid", gap: 16, marginTop: 20 }}>
          {TOP_CODES.map((block) => (
            <section
              key={block.title}
              style={{
                padding: 18,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(0,0,0,0.20)",
              }}
            >
              <h2 style={{ margin: 0, fontSize: 20 }}>{block.title}</h2>

              <div
                style={{
                  display: "grid",
                  gap: 10,
                  marginTop: 12,
                }}
              >
                {block.items.map((it) => (
                  <Link
                    key={it.id}
                    href={`/code/${it.id}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.08)",
                      textDecoration: "none",
                      color: "inherit",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <span>{it.label}</span>
                    <span style={{ opacity: 0.65, fontSize: 13 }}>{it.category}</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <Link
            href="/"
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
            ← Retour à l’accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
