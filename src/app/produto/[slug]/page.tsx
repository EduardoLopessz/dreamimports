import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StarIcon } from "@/components/icons";
import { Photo } from "@/components/photo";
import { ProductCard } from "@/components/product/product-card";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { PRODUCTS } from "@/db/data";
import { discountPercent, formatPrice, installment, pixPrice, pexels } from "@/lib/utils";
import { CATEGORY_LABEL, getProduct, relatedProducts, reviewsFor } from "@/server/catalog";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/produto/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.name}: ${p.description} ${formatPrice(p.priceCents)} ou ${formatPrice(pixPrice(p.priceCents))} no Pix.`,
    openGraph: { title: p.name, images: [{ url: pexels(p.images[0].pexelsId), alt: p.images[0].alt }] },
  };
}

export default async function ProductPage(props: PageProps<"/produto/[slug]">) {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) notFound();
  const reviews = reviewsFor(slug);
  const related = relatedProducts(product);
  const off = discountPercent(product.priceCents, product.compareAtCents ?? undefined);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => pexels(i.pexelsId)),
    brand: { "@type": "Brand", name: "Dream Store" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount },
    offers: { "@type": "Offer", priceCurrency: "BRL", price: (product.priceCents / 100).toFixed(2), availability: "https://schema.org/InStock" },
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-4 pt-6 md:px-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Trilha" className="text-sm text-muted">
        <Link href="/" className="hover:text-ink">
          Início
        </Link>{" "}
        /{" "}
        <Link href={`/c/${product.category}`} className="hover:text-ink">
          {CATEGORY_LABEL[product.category]}
        </Link>{" "}
        / <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16">
        <div className="grid gap-3 sm:grid-cols-2">
          {product.images.map((img, i) => (
            <Photo
              key={img.pexelsId}
              image={img}
              priority={i === 0}
              quality={85}
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
              className={product.images.length === 1 ? "aspect-[4/5] sm:col-span-2" : "aspect-[4/5]"}
            />
          ))}
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          {off > 0 ? (
            <p className="font-medium text-sale">{off}% off</p>
          ) : product.badge === "mais-vendido" ? (
            <p className="font-medium text-accent">Mais vendido</p>
          ) : product.badge === "novo" ? (
            <p className="font-medium text-accent">Novo</p>
          ) : null}
          <h1 className="mt-1 text-3xl font-medium">{product.name}</h1>
          <p className="text-muted">{product.subtitle}</p>
          <a href="#avaliacoes" className="mt-2 flex items-center gap-1 text-sm">
            <StarIcon weight="fill" size={16} aria-hidden />
            <span className="font-medium">{product.rating.toLocaleString("pt-BR")}</span>
            <span className="text-muted underline underline-offset-2">({product.reviewCount.toLocaleString("pt-BR")} avaliações)</span>
          </a>

          <p className="mt-6 text-xl font-medium">
            {formatPrice(product.priceCents)}
            {product.compareAtCents && (
              <span className="ml-2 text-base font-normal text-muted line-through">{formatPrice(product.compareAtCents)}</span>
            )}
          </p>
          <p className="text-sm">
            <span className="font-medium text-pix">{formatPrice(pixPrice(product.priceCents))} no Pix</span>
            <span className="text-muted"> ou 10x de {formatPrice(installment(product.priceCents))} sem juros</span>
          </p>
          <p className="mt-2 text-sm text-muted">{product.soldLastWeek} vendidos nos últimos 7 dias</p>

          <PurchasePanel
            product={{
              slug: product.slug,
              name: product.name,
              subtitle: product.subtitle,
              priceCents: product.priceCents,
              image: product.images[0],
              colors: product.colors,
              sizes: product.sizes,
            }}
          />

          <p className="mt-8 leading-relaxed">{product.description}</p>
          <details className="group mt-6 border-t border-line py-4" open>
            <summary className="cursor-pointer list-none text-lg font-medium">Detalhes do produto</summary>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
              {product.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </details>
          <details className="border-t border-line py-4">
            <summary className="cursor-pointer list-none text-lg font-medium">Entrega e trocas</summary>
            <p className="mt-3 text-muted">
              Frete grátis acima de R$ 299. A primeira troca é grátis em até 30 dias após o recebimento, direto pelo site.
            </p>
          </details>
        </div>
      </div>

      <section id="avaliacoes" aria-labelledby="avaliacoes-title" className="mt-24 scroll-mt-20">
        <div className="flex items-end justify-between gap-4">
          <h2 id="avaliacoes-title" className="text-2xl font-medium">
            Avaliações ({product.reviewCount.toLocaleString("pt-BR")})
          </h2>
          <p className="flex items-center gap-1 text-lg font-medium">
            <StarIcon weight="fill" size={20} aria-hidden /> {product.rating.toLocaleString("pt-BR")} de 5
          </p>
        </div>
        <ul className="mt-6 grid gap-3 md:grid-cols-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-line p-6">
              <p className="flex gap-0.5" aria-label={`${r.rating} de 5 estrelas`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} size={16} weight={i < r.rating ? "fill" : "regular"} aria-hidden />
                ))}
              </p>
              <p className="mt-3 font-medium">{r.title}</p>
              <p className="mt-1 text-muted">{r.body}</p>
              <p className="mt-4 text-sm">
                <span className="font-medium">{r.author}</span>, {r.city}
              </p>
              <p className="text-sm text-pix">Compra verificada, tamanho {r.sizeBought}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="complete-look" className="mt-24">
        <h2 id="complete-look" className="text-2xl font-medium">
          Complete o look
        </h2>
        <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4">
          {related.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} sizes="(min-width: 1024px) 25vw, 50vw" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
