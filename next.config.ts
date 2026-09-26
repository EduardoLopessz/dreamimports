import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fotos reais do Pexels (licença livre para uso comercial).
    // `search` exato: o otimizador só aceita a versão de 1920px (ver `pexels()` em src/lib/utils.ts).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**",
        search: "?auto=compress&cs=tinysrgb&w=1920",
      },
    ],
    qualities: [75, 85],
  },
};

export default nextConfig;
