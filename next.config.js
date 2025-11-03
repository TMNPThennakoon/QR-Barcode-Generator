/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/QR-Barcode-Generator',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
