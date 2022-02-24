const path = require('path')

module.exports = {
  reactStrictMode: true,
  eslint: {
    // Warning: Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    NEXT_PUBLIC_NOTION_API_TOKEN: process.env.NOTION_API_TOKEN,
    NEXT_PUBLIC_NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  },
}
