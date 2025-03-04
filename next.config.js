/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        turbo: {
          rules: {
            "*.js": [],
            "*.ts": [],
            "*.tsx": [],
          },
        },
      },
};

module.exports = nextConfig;
