/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for the Docker multi-stage build (copies only needed files)
  output: 'standalone',

  // In Docker, the proxy handles /api routing.
  // These rewrites only apply in local development (next dev without Docker).
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
