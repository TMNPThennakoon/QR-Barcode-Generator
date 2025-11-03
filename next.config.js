/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production'
const isDeploy = process.env.DEPLOY === 'true'

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: (isProduction && isDeploy) ? '/QR-Barcode-Generator' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
