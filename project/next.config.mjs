import withPWA from 'next-pwa';
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },
  // Turbopack configuration for Next.js 16
  turbopack: {
    // Set the Turbopack root to the current working directory (absolute at runtime)
    root: process.cwd(),
    resolveAlias: {
      // Helps with file watching on Windows
    },
  },
  // Alternative webpack config (fallback)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

const pwaOptions = {
  dest: 'public',
  register: true,
  skipWaiting: true,
};

export default withPWA(pwaOptions)(nextConfig);