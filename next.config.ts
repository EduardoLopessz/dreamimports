import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fotos reais do Pexels (licença livre para uso comercial).
    remotePatterns: [{ protocol: "https", hostname: "images.pexels.com", pathname: "/photos/**" }],
    qualities: [75, 85],
  },
};

export default nextConfig;
