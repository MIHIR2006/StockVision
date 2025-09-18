import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Remove turbo config to fix warning
  },
  // Prevent Next from picking a wrong workspace root in monorepo setups
  outputFileTracingRoot: path.join(__dirname, '..'),
  // Skip ESLint during production builds to avoid incompatible CLI options errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ensure proper transpilation
  transpilePackages: [],
  // Remove standalone output for better compatibility
  // output: 'standalone',
  // Disable image optimization for development
  images: {
    unoptimized: true,
  },
  // Add security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

export default nextConfig 