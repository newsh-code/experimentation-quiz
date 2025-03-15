/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  // Configure asset prefix if deploying to a subdirectory
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/quiz' : '',
  // Configure base path if deploying to a subdirectory
  // basePath: process.env.NODE_ENV === 'production' ? '/quiz' : '',
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
}

module.exports = nextConfig 