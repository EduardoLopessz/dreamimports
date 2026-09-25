import Link from "next/link";
import type { Product } from "@/db/schema";
import { Photo } from "@/components/photo";
import { cn, discountPercent, formatPrice, installment, pixPrice } from "@/lib/utils";
import { FavoriteButton } from "./favorite-button";

const BADGE: Record<NonNullable<Product["badge"]>, { label: string; className: string }> = {
  novo: { label: "Novo", className: "text-accent" },
  "mais-vendido": { label: "Mais vendido", className: "text-accent" },
  "ultimas-unidades": { label: "Últimas unidades", className: "text-sale" },
};

export function ProductCard({ product, sizes, priority }: { product: Product; sizes: string; priority?: boolean }) {
  const off = discountPercent(product.priceCents, product.compareAtCents ?? undefined);
  const badge = off > 0 ? { label: `${off}% off`, className: "text-sale" } : product.badge ? BADGE[product.badge] : null;
  return (
    <article className="group relative">
      <Link href={`/produto/${product.slug}`} className="block">
        <Photo
          image={product.images[0]}
          sizes={sizes}
          priority={priority}
          className="aspect-square"
          imgClassName="transition-transform duration-700 ease-fluid group-hover:scale-[1.04]"
        />
        <div className="mt-3 space-y-0.5">
          {badge && <p className={cn("font-medium", badge.className)}>{badge.label}</p>}
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-muted">{product.subtitle}</p>
          <p className="text-muted">
            {product.colors.length} {product.colors.length === 1 ? "cor" : "cores"}
          </p>
          <p className="pt-2 font-medium">
            {formatPrice(product.priceCents)}
            {product.compareAtCents && (
              <span className="ml-2 font-normal text-muted line-through">{formatPrice(product.compareAtCents)}</span>
            )}
          </p>
          <p className="text-sm text-muted">
            <span className="font-medium text-pix">{formatPrice(pixPrice(product.priceCents))} no Pix</span> ou 10x de{" "}
            {formatPrice(installment(product.priceCents))}
          </p>
        </div>
      </Link>
      <FavoriteButton slug={product.slug} name={product.name} className="absolute top-3 right-3" />
    </article>
  );
}
