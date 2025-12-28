import "./globals.css";

export const metadata = {
  title: "CodeClair — Comprendre les codes sur les produits",
  description: "Entrez un code (PAP, PET, 12M, LOT...) et obtenez une explication claire."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
