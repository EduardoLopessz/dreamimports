"use client";

import { HeartIcon } from "@/components/icons";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import type { Product } from "@/db/schema";
import { useFavorites } from "@/store/cart";

export function FavoritesGrid({ products }: { products: Product[] }) {
  const slugs = useFavorites((s) => s.slugs);
  const items = products.filter((p) => slugs.includes(p.slug));

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <HeartIcon size={48} className="text-muted" />
        <p className="text-lg font-medium">Você ainda não salvou nenhuma peça</p>
        <p className="max-w-sm text-muted">Toque no coração de qualquer produto para guardar aqui e comprar depois.</p>
        <ButtonLink href="/c/lancamentos">Ver lançamentos</ButtonLink>
      </div>
    );
  }

  return (
    <section aria-labelledby="favoritos-lista">
      <h2 id="favoritos-lista" className="sr-only">
        Peças salvas
      </h2>
      <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-3">
        {items.map((p) => (
          <li key={p.slug}>
            <ProductCard product={p} sizes="(min-width: 1024px) 33vw, 50vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
