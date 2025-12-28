import codesData from "@/data/codes.json";

type CodeEntry = { id: string };

export default function sitemap() {
  const DB = codesData as CodeEntry[];

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const now = new Date().toISOString();

  const urls = DB.map((e) => ({
    url: `${baseUrl}/code/${e.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Home + pagine codici
  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...urls,
  ];
}
