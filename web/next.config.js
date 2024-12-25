/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  experimental: {
    // 配置 Turbopack
    turbo: {
      resolveAlias: {
        // 添加源码映射配置
        '@/*': './src/*'
      }
    }
  }
}

module.exports = nextConfig; 