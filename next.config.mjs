/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: 'nodejs', // Ensure it's using Node.js runtime instead of the Edge runtime
  },
  webpack: async (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        crypto: await import('crypto-browserify'),
        stream: await import('stream-browserify'),
      };
    }
    return config;
  },
};

export default nextConfig;
