import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fotos reais do Unsplash (licença livre para uso comercial).
    // O link de download redireciona para images.unsplash.com.
    remotePatterns: [
      { protocol: "https", hostname: "unsplash.com", pathname: "/photos/**" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    qualities: [75, 85],
  },
};

export default nextConfig;
