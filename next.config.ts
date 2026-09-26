import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fotos reais do Pexels (licença livre para uso comercial), servidas pelo CDN deles.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Poucos tamanhos: cada um é uma versão à parte no CDN, então menos tamanhos = mais visitas
    // encontrando a foto já pronta. Nada acima de 1920px.
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [96, 128, 256, 384],
  },
};

export default nextConfig;
