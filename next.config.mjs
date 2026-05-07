import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const STATIC_EXPORT = process.env.NEXT_OUTPUT === 'export';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // When deploying to Hostinger (or any shared Apache host) we ship a fully
  // static `out/` directory. Setting NEXT_OUTPUT=export at build time switches
  // Next into static-export mode and disables image optimisation (since there
  // is no Next.js server at runtime).
  ...(STATIC_EXPORT ? { output: 'export', trailingSlash: true } : {}),
  images: {
    unoptimized: STATIC_EXPORT,
    remotePatterns: [
      { protocol: 'https', hostname: 'nhmbeo.rs' },
      { protocol: 'https', hostname: 'www.nhmbeo.rs' },
      { protocol: 'https', hostname: 'muzejzagubica.org' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
    ],
  },
};

export default withNextIntl(nextConfig);
