import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Google Analytics (GA4) loader.
 * - Off by default. Set NEXT_PUBLIC_GA_MEASUREMENT_ID in `.env.local` to
 *   enable (e.g. "G-XXXXXXXXXX").
 * - Once set, GA fires on every page; Search Console can auto-verify your
 *   property using the "Google Analytics" verification method while you're
 *   signed into the same Google account — no token to paste.
 */
export default function Analytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
