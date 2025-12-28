import codesData from "@/data/codes.json";
import Link from "next/link";
import { notFound } from "next/navigation";

type CodeEntry = {
  id: string;
  codes: string[];
  category: string;
  title_fr: string;
  meaning_fr: string;
  action_fr: string;
  warning_fr: string;
  tip_fr: string;
};

const DB = codesData as CodeEntry[];

function safeLowerId(id: unknown): string | null {
  if (typeof id !== "string") return null;
  const v = id.trim();
  if (!v) return null;
  return v.toLowerCase();
}

function findById(id: unknown): CodeEntry | null {
  const lower = safeLowerId(id);
  if (!lower) return null;
  return DB.find((e) => (e.id ?? "").toLowerCase() === lower) ?? null;
}

export async function generateStaticParams() {
  return DB.map((e) => ({ id: e.id }));
}

// ✅ Next 16: params può essere Promise → facciamo async + await
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;
  const entry = findById(id);

  if (!entry) {
    return {
      title: "Code introuvable — CodeClair",
      description: "Ce code n’existe pas encore dans notre base.",
    };
  }

  const mainCode = entry.codes?.[0] ?? entry.id;

  return {
    title: `${mainCode} — ${entry.title_fr} | CodeClair`,
    description: `${mainCode} : ${entry.meaning_fr}`.slice(0, 155),
  };
}

// ✅ Next 16: params può essere Promise → facciamo async + await
export default async function CodePage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;

  const entry = findById(id);
  if (!entry) return notFound();

  const mainCode = entry.codes?.[0] ?? entry.id;

  return (
    <main className="container">
      <div className="card">
        <div className="badge">
          {entry.category} • Code : {mainCode}
        </div>

        <h1 style={{ marginTop: 6 }}>
          {mainCode} — {entry.title_fr}
        </h1>
        <p style={{ marginTop: 8 }}>
          Explication claire et action recommandée (France).
        </p>

        <div className="grid" style={{ marginTop: 14 }}>
          <div className="block">
            <div className="label">Signification</div>
            <div className="small">{entry.title_fr}</div>
            <div style={{ marginTop: 8 }}>{entry.meaning_fr}</div>
          </div>

          <div className="block">
            <div className="label">Que faire ?</div>
            <div style={{ marginTop: 8 }}>{entry.action_fr}</div>
          </div>

          <div className="block">
            <div className="label">Attention</div>
            <div style={{ marginTop: 8 }}>{entry.warning_fr}</div>
          </div>

          <div className="block">
            <div className="label">Conseil pratique</div>
            <div style={{ marginTop: 8 }}>{entry.tip_fr}</div>
          </div>
        </div>

        <div className="block" style={{ marginTop: 14 }}>
          <div className="label">Rechercher un autre code</div>
          <div className="small" style={{ marginTop: 6 }}>
            Retournez à la page d’accueil pour rechercher un autre code.
          </div>
          <div style={{ marginTop: 10 }}>
            <Link className="btn" href="/">
              ↩ Accueil
            </Link>
          </div>
        </div>

        {entry.codes?.length > 1 && (
          <div className="footer" style={{ marginTop: 14 }}>
            Autres écritures possibles :{" "}
            {entry.codes.map((c, idx) => (
              <span key={c}>
                <code>{c}</code>
                {idx < entry.codes.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
