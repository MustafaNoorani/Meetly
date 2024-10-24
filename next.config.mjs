/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enabling fallback for unsupported edge modules
  experimental: {
    runtime: 'nodejs',
  },
  // Custom webpack configuration to handle crypto dependencies
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      };
    }
    return config;
  },
};

export default nextConfig;
