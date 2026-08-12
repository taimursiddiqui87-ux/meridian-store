/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * `npm run build:cpanel` sets BUILD_STANDALONE=1 to emit a self-contained
   * server for cPanel/Passenger hosting. Vercel builds are untouched.
   */
  output: process.env.BUILD_STANDALONE === "1" ? "standalone" : undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
};

export default nextConfig;
