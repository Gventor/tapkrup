/** @type {import('next').NextConfig} */
const nextConfig = {
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
