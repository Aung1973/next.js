module.exports = {
  experimental: {
    serverMinification: true,
  },
  generateBuildId() {
    return 'FIXED'
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}
