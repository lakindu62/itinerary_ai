/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Minio server (your local/production setup)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'minio.yourdomain.com', // Replace with your production domain
        pathname: '/**',
      },
      // External image services (for fallbacks)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      // Add any other image domains you might use
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      }
    ],
    // Alternative configuration if you prefer domains (older Next.js style)
    // domains: ['localhost:9000', 'images.unsplash.com', 'via.placeholder.com'],
  },
  // Enable experimental features if needed
  experimental: {
    turbo: {
      // Turbopack configuration if needed
    },
  },
}

module.exports = nextConfig