import type { Metadata } from 'next';
import { siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
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
