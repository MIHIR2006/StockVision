/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Remove turbo config to fix warning
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