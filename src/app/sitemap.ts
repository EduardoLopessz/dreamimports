import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/db/data";

const base = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const collections = [
    "lancamentos",
    "masculino",
    "feminino",
    "unissex",
    "outlet",
    "moletons",
    "camisetas",
    "calcas",
    "jaquetas",
  ];
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    ...collections.map((c) => ({ url: `${base}/c/${c}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...PRODUCTS.map((p) => ({ url: `${base}/produto/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    { url: `${base}/ajuda`, changeFrequency: "monthly", priority: 0.3 },
  ];
}
