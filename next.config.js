/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'peorumavyucumxvrzcme.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
