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
  webpack: (config, { isServer }) => {
    // Fix module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Ensure proper module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
    };
    
    return config;
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  distDir: '.next',
  experimental: {
    // Remove appDir since it's causing issues
    typedRoutes: true,
    scrollRestoration: true
  },
  // Ensure proper static file serving
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add Vercel-specific optimizations
  typescript: {
    ignoreBuildErrors: false,
  },
  // Ensure proper static file serving
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
}

module.exports = nextConfig 