import type { NextConfig } from "next";

const posthog_proxy_path = process.env.NEXT_PUBLIC_POSTHOG_PROXY_PATH;

const nextConfig: NextConfig = {
  // Required so PostHog API requests with trailing slashes aren't redirected
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: `${posthog_proxy_path}/static/:path*`,
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: `${posthog_proxy_path}/array/:path*`,
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: `${posthog_proxy_path}/:path*`,
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
};

export default nextConfig;
