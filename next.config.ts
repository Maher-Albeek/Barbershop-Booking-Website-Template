import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true
  },
  async rewrites() {
    return [
      {
        source: "/:locale(en|de|ar)/admin/login",
        destination: "/:locale/login?role=admin"
      },
      {
        source: "/:locale(en|de|ar)/employee/login",
        destination: "/:locale/login?role=employee"
      }
    ];
  }
};

export default nextConfig;
