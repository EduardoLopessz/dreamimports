import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils";
import { COLLECTIONS, isCollection, listProducts, type SortKey } from "@/server/catalog";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "relevancia", label: "Mais vendidos" },
  { key: "menor-preco", label: "Menor preço" },
  { key: "maior-preco", label: "Maior preço" },
  { key: "avaliacao", label: "Melhor avaliados" },
];

const CATEGORY_FILTERS = [
  { key: undefined, label: "Tudo" },
  { key: "moletons", label: "Moletons" },
  { key: "camisetas", label: "Camisetas" },
  { key: "calcas", label: "Calças" },
  { key: "jaquetas", label: "Jaquetas" },
] as const;

type Category = NonNullable<(typeof CATEGORY_FILTERS)[number]["key"]>;

export function generateStaticParams() {
  return Object.keys(COLLECTIONS).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/c/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  if (!isCollection(slug)) return {};
  const title = COLLECTIONS[slug].title;
  return { title, description: `${title} da Dream Store: streetwear com 5% off no Pix, 10x sem juros e troca grátis em 30 dias.` };
}

export default async function CollectionPage(props: PageProps<"/c/[slug]">) {
  const { slug } = await props.params;
  if (!isCollection(slug)) notFound();
  const sp = await props.searchParams;
  const sort = (SORTS.find((s) => s.key === sp.ordem)?.key ?? "relevancia") as SortKey;
  const category = CATEGORY_FILTERS.find((c) => c.key === sp.categoria)?.key as Category | undefined;
  const isCategoryPage = ["moletons", "camisetas", "calcas", "jaquetas"].includes(slug);
  const products = listProducts({ collection: slug, category: isCategoryPage ? undefined : category, sort });

  const href = (next: { ordem?: string; categoria?: string }) => {
    const params = new URLSearchParams();
    const ordem = next.ordem ?? sort;
    const cat = "categoria" in next ? next.categoria : category;
    if (ordem !== "relevancia") params.set("ordem", ordem);
    if (cat) params.set("categoria", cat);
    const qs = params.toString();
    return `/c/${slug}${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-4 pt-8 md:px-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-medium">
            {COLLECTIONS[slug].title} <span className="text-muted">({products.length})</span>
          </h1>
          {slug === "outlet" && <p className="mt-1 text-muted">Peças com desconto enquanto durar o estoque.</p>}
        </div>
        <nav aria-label="Ordenar" className="flex flex-wrap gap-2">
          {SORTS.map((s) => (
            <Link
              key={s.key}
              href={href({ ordem: s.key })}
              aria-current={s.key === sort ? "true" : undefined}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                s.key === sort ? "border-ink bg-ink text-white" : "border-line hover:border-ink",
              )}
            >
              {s.label}
            </Link>
          ))}
        </nav>
      </div>

      {!isCategoryPage && (
        <nav aria-label="Filtrar por categoria" className="scrollbar-none mt-6 flex gap-6 overflow-x-auto border-b border-line">
          {CATEGORY_FILTERS.map((c) => {
            const active = c.key === category;
            return (
              <Link
                key={c.label}
                href={href({ categoria: c.key })}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "-mb-px border-b-2 pb-3 text-base font-medium whitespace-nowrap",
                  active ? "border-ink" : "border-transparent text-muted hover:text-ink",
                )}
              >
                {c.label}
              </Link>
            );
          })}
        </nav>
      )}

      {products.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-lg font-medium">Nenhuma peça nesta combinação.</p>
          <Link href={`/c/${slug}`} className="mt-2 inline-block underline underline-offset-4">
            Limpar filtros
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-3">
          {products.map((p, i) => (
            <li key={p.slug}>
              <ProductCard product={p} priority={i < 2} sizes="(min-width: 1024px) 33vw, 50vw" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
