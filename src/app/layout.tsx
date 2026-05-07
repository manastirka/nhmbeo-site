import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Природњачки музеј у Београду',
    template: '%s — Природњачки музеј у Београду',
  },
  description:
    'Природњачки музеј у Београду — основан 1895. године. Преко 2.000.000 музејских предмета.',
};

// This root layout intentionally only forwards children.
// The actual <html> and <body> elements are rendered in [locale]/layout.tsx
// so that lang reflects the active locale.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
