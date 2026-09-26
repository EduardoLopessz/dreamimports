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

// Faixas com limite superior inclusivo: R$ 150,00 cai em "Até R$ 150".
export const PRICE_RANGES = [
  { key: "ate-150", label: "Até R$ 150", min: -1, max: 15000 },
  { key: "150-250", label: "De R$ 150 a R$ 250", min: 15000, max: 25000 },
  { key: "acima-250", label: "Acima de R$ 250", min: 25000, max: Infinity },
] as const;
export type PriceKey = (typeof PRICE_RANGES)[number]["key"];
export const SIZE_ORDER = ["P", "M", "G", "GG", "XG"];

export type ListFilters = {
  collection?: CollectionSlug;
  category?: Category;
  sort?: SortKey;
  /** Tamanhos com estoque; qualquer um serve (OU). */
  sizes?: string[];
  colors?: string[];
  price?: PriceKey;
};

type Dimension = "category" | "sizes" | "colors" | "price";

const inRange = (p: Product, key: PriceKey) => {
  const r = PRICE_RANGES.find((x) => x.key === key)!;
  return p.priceCents > r.min && p.priceCents <= r.max;
};

/** Aplica a coleção e todos os filtros, exceto a dimensão `skip` (usada para contar as opções dela). */
function applyFilters(opts: ListFilters, skip?: Dimension) {
  let items = PRODUCTS;
  if (opts.collection) items = items.filter(COLLECTIONS[opts.collection].filter);
  if (opts.category && skip !== "category") items = items.filter((p) => p.category === opts.category);
  if (opts.sizes?.length && skip !== "sizes")
    items = items.filter((p) => p.sizes.some((s) => s.stock > 0 && opts.sizes!.includes(s.label)));
  if (opts.colors?.length && skip !== "colors")
    items = items.filter((p) => p.colors.some((c) => opts.colors!.includes(c.name)));
  if (opts.price && skip !== "price") items = items.filter((p) => inRange(p, opts.price!));
  return items;
}

export function listProducts(opts: ListFilters = {}) {
  const items = applyFilters(opts);
  switch (opts.sort) {
    case "menor-preco":
      return items.toSorted((a, b) => a.priceCents - b.priceCents);
    case "maior-preco":
      return items.toSorted((a, b) => b.priceCents - a.priceCents);
    case "avaliacao":
      return items.toSorted((a, b) => b.rating - a.rating);
    default: {
      // Em Masculino/Feminino, as peças do próprio gênero vêm antes das unissex.
      const own = opts.collection === "masculino" || opts.collection === "feminino" ? opts.collection : null;
      const rank = (p: Product) => (own && p.gender === own ? 1 : 0);
      return items.toSorted((a, b) => rank(b) - rank(a) || b.soldLastWeek - a.soldLastWeek);
    }
  }
}

/**
 * Opções de filtro da coleção. Cada contagem considera os outros filtros ativos
 * (busca facetada), então o número mostrado é o que o clique vai retornar.
 */
export function facetsFor(opts: ListFilters & { collection: CollectionSlug }) {
  const all = PRODUCTS.filter(COLLECTIONS[opts.collection].filter);
  const bySize = applyFilters(opts, "sizes");
  const byColor = applyFilters(opts, "colors");
  const byPrice = applyFilters(opts, "price");

  const colorHex = new Map<string, string>();
  for (const p of all) for (const c of p.colors) if (!colorHex.has(c.name)) colorHex.set(c.name, c.hex);
  const sizeLabels = new Set(all.flatMap((p) => p.sizes.filter((s) => s.stock > 0).map((s) => s.label)));

  return {
    colors: [...colorHex]
      .map(([name, hex]) => ({ name, hex, count: byColor.filter((p) => p.colors.some((c) => c.name === name)).length }))
      .toSorted((a, b) => b.count - a.count),
    sizes: SIZE_ORDER.filter((s) => sizeLabels.has(s)).map((label) => ({
      label,
      count: bySize.filter((p) => p.sizes.some((s) => s.label === label && s.stock > 0)).length,
    })),
    prices: PRICE_RANGES.map((r) => ({ ...r, count: byPrice.filter((p) => inRange(p, r.key)).length })),
  };
}

export function bestSellers(limit = 8) {
  return listProducts().slice(0, limit);
}

export function searchProducts(query: string, limit = 6) {
  const q = normalize(query);
  if (!q) return [];
  return PRODUCTS.filter((p) =>
    normalize(
      `${p.name} ${p.subtitle} ${CATEGORY_LABEL[p.category]} ${p.colors.map((c) => c.name).join(" ")}`,
    ).includes(q),
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
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}
