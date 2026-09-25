import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import { PRODUCTS } from "@/db/data";
import { getProduct, searchProducts } from "./catalog";

const t = initTRPC.create({ transformer: superjson });

export const appRouter = t.router({
  search: t.procedure.input(z.object({ q: z.string().max(80) })).query(({ input }) =>
    searchProducts(input.q).map((p) => ({
      slug: p.slug,
      name: p.name,
      subtitle: p.subtitle,
      priceCents: p.priceCents,
      image: p.images[0],
    })),
  ),

  /** Produto mínimo para a sacola e o "complete o look". */
  product: t.procedure.input(z.object({ slug: z.string() })).query(({ input }) => {
    const p = getProduct(input.slug);
    if (!p) return null;
    return { slug: p.slug, name: p.name, subtitle: p.subtitle, priceCents: p.priceCents, image: p.images[0] };
  }),

  /** Prova social: compras recentes (dados de demonstração). */
  recentPurchase: t.procedure.input(z.object({ seed: z.number().int() })).query(({ input }) => {
    const buyers = ["Ana, de Curitiba", "Rafael, de Salvador", "Júlia, de Porto Alegre", "Caio, de Fortaleza", "Marina, de Campinas"];
    const p = PRODUCTS[Math.abs(input.seed) % PRODUCTS.length];
    return {
      buyer: buyers[Math.abs(input.seed) % buyers.length],
      minutesAgo: (Math.abs(input.seed * 7) % 14) + 2,
      product: { slug: p.slug, name: p.name, image: p.images[0] },
    };
  }),
});

export type AppRouter = typeof appRouter;
