export const metadata = {
  title: "CodeClair",
  description: "Comprendre les codes sur les produits",
  verification: {
    google: "tc5zz-30vxn2UXrM31LvEi0sJUybr0hRyifGc7CnULU",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
