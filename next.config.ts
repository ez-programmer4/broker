import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
};

export default nextConfig;