/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Only ignore build errors in production, enable checking in development
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  images: {
    unoptimized: true,
  },
  // Ensure environment variables are properly loaded
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Handle dynamic routes properly
  trailingSlash: false,
  // Enable strict mode for better error handling
  reactStrictMode: true,
  // Ensure proper handling of dynamic imports
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
}

export default nextConfig
