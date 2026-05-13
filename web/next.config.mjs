/** @type {import('next').NextConfig} */
const config = {
  output: 'standalone',   // required for Docker multi-stage build
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'illustrates.dev' },
      { protocol: 'https', hostname: 'img.clerk.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',       value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default config
