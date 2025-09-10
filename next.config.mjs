/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Optional: For better deployment compatibility
  trailingSlash: false,
  // Optional: For static export (if your hosting doesn't support Node.js)
  // output: 'export',
  // Optional: For better performance
  compress: true,
  // Optional: For WHM hosting compatibility
  distDir: '.next',
}

export default nextConfig
