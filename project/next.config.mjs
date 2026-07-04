import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },
  // Turbopack configuration for development
  turbopack: {
    root: process.cwd(),
  },
};

const pwaOptions = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  // Disable in development, enable in production (including Vercel)
  disable: process.env.NODE_ENV === 'development',
  // Customize cache
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/lh3\.googleusercontent\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-images',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'firestore-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\.firebaseio\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'firebase-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
  ],
};

export default withPWA(pwaOptions)(nextConfig);