import "server-only";
import { PRODUCTS, REVIEWS } from "@/db/data";
import type { Category, Gender, Product } from "@/db/schema";

export const CATEGORY_LABEL: Record<Category, string> = {
  moletons: "Moletons",
  camisetas: "Camisetas",
  calcas: "Calças",
  jaquetas: "Jaquetas",
};

export const GENDER_LABEL: Record<Gender, string> = {
  masculino: "Masculino",
  feminino: "Feminino",
  unissex: "Unissex",
};

/** Coleções navegáveis em /c/[slug]. */
export const COLLECTIONS = {
  lancamentos: { title: "Lançamentos", filter: (p: Product) => p.badge === "novo" || p.soldLastWeek > 150 },
  masculino: { title: "Masculino", filter: (p: Product) => p.gender !== "feminino" },
  feminino: { title: "Feminino", filter: (p: Product) => p.gender !== "masculino" },
  unissex: { title: "Unissex", filter: (p: Product) => p.gender === "unissex" },
  outlet: { title: "Outlet", filter: (p: Product) => p.compareAtCents !== null },
  moletons: { title: "Moletons", filter: (p: Product) => p.category === "moletons" },
  camisetas: { title: "Camisetas", filter: (p: Product) => p.category === "camisetas" },
  calcas: { title: "Calças", filter: (p: Product) => p.category === "calcas" },
  jaquetas: { title: "Jaquetas", filter: (p: Product) => p.category === "jaquetas" },
} as const satisfies Record<string, { title: string; filter: (p: Product) => boolean }>;

export type CollectionSlug = keyof typeof COLLECTIONS;
export type SortKey = "relevancia" | "menor-preco" | "maior-preco" | "avaliacao";

const bySlug = new Map(PRODUCTS.map((p) => [p.slug, p]));

export function isCollection(slug: string): slug is CollectionSlug {
  return slug in COLLECTIONS;
}

export function getProduct(slug: string) {
  return bySlug.get(slug) ?? null;
}

export function listProducts(opts: { collection?: CollectionSlug; category?: Category; sort?: SortKey } = {}) {
  let items = PRODUCTS;
  if (opts.collection) items = items.filter(COLLECTIONS[opts.collection].filter);
  if (opts.category) items = items.filter((p) => p.category === opts.category);
  switch (opts.sort) {
    case "menor-preco":
      return items.toSorted((a, b) => a.priceCents - b.priceCents);
    case "maior-preco":
      return items.toSorted((a, b) => b.priceCents - a.priceCents);
    case "avaliacao":
      return items.toSorted((a, b) => b.rating - a.rating);
    default:
      return items.toSorted((a, b) => b.soldLastWeek - a.soldLastWeek);
  }
}

export function bestSellers(limit = 8) {
  return listProducts().slice(0, limit);
}

export function searchProducts(query: string, limit = 6) {
  const q = normalize(query);
  if (!q) return [];
  return PRODUCTS.filter((p) =>
    normalize(`${p.name} ${p.subtitle} ${CATEGORY_LABEL[p.category]} ${p.colors.map((c) => c.name).join(" ")}`).includes(q),
  ).slice(0, limit);
}

export function reviewsFor(slug: string) {
  return REVIEWS.filter((r) => r.productSlug === slug);
}

export function relatedProducts(product: Product, limit = 4) {
  return PRODUCTS.filter((p) => p.slug !== product.slug && p.category !== product.category)
    .toSorted((a, b) => b.soldLastWeek - a.soldLastWeek)
    .slice(0, limit);
}

function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}
