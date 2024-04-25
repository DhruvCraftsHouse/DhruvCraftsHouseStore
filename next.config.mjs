/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'dhruvcraftshouse.com'],
        unoptimized: true, // Disable the Image Optimization API
    },
    output: 'export',
    trailingSlash: true,
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
      },
    // experimental: {
    //     serverActions: true,
    // }
};


export default nextConfig;
