/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  distDir: '.next',
  experimental: {
    // Remove appDir since it's causing issues
    typedRoutes: true,
    scrollRestoration: true
  }
}

module.exports = nextConfig 