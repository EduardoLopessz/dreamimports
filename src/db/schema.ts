import { integer, jsonb, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Schema do catálogo. Hoje os dados vêm de `src/db/data.ts` (mesmo formato);
 * quando o banco (Postgres, por exemplo Neon na Vercel) for conectado, a camada
 * `src/server/catalog.ts` passa a consultar estas tabelas sem mudar o resto do app.
 */
export const products = pgTable("products", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  category: text("category", { enum: ["moletons", "camisetas", "calcas", "jaquetas"] }).notNull(),
  gender: text("gender", { enum: ["masculino", "feminino", "unissex"] }).notNull(),
  priceCents: integer("price_cents").notNull(),
  compareAtCents: integer("compare_at_cents"),
  images: jsonb("images").$type<ProductImage[]>().notNull(),
  colors: jsonb("colors").$type<ProductColor[]>().notNull(),
  sizes: jsonb("sizes").$type<ProductSize[]>().notNull(),
  badge: text("badge", { enum: ["novo", "mais-vendido", "ultimas-unidades"] }),
  rating: real("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  soldLastWeek: integer("sold_last_week").notNull(),
  details: jsonb("details").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  productSlug: text("product_slug")
    .notNull()
    .references(() => products.slug),
  author: text("author").notNull(),
  city: text("city").notNull(),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  sizeBought: text("size_bought").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

/**
 * Foto do Pexels: o ID é o número no fim da URL da página da foto.
 * `focus` é o object-position (ponto que não pode ser cortado, normalmente o rosto).
 */
export type ProductImage = { pexelsId: string; alt: string; author: string; focus?: string };
export type ProductColor = { name: string; hex: string };
export type ProductSize = { label: string; stock: number };

export type Product = Omit<typeof products.$inferSelect, "createdAt">;
export type Review = Omit<typeof reviews.$inferSelect, "createdAt"> & { createdAt: string };
export type Category = Product["category"];
export type Gender = Product["gender"];
