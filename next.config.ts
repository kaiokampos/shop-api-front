import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Define o root correto para evitar o aviso de múltiplos lockfiles
    root: __dirname,
  },
};

export default nextConfig;
