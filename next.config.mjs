/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: 'nodejs', // Ensures usage of Node.js runtime instead of Edge
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
      };
    }
    return config;
  },
};

export default nextConfig;
