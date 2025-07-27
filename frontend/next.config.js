/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Remove turbo config to fix warning
  },
  // Ensure proper transpilation
  transpilePackages: [],
  // Configure for monorepo
  output: 'standalone',
  // Disable image optimization for development
  images: {
    unoptimized: true,
  },
}

export default nextConfig 