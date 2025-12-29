/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ucarecdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.uploadcare.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Allow local dev origin for HMR/asset requests (avoids cross-origin warning)
  allowedDevOrigins: ['http://localhost:3000', 'http://127.0.0.1:3000'],
};

module.exports = nextConfig;
