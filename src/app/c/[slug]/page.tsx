import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaretDownIcon, CheckIcon } from "@/components/icons";
import { ProductCard } from "@/components/product/product-card";
import type { Category } from "@/db/schema";
import { cn } from "@/lib/utils";
import {
  COLLECTIONS,
  facetsFor,
  isCollection,
  listProducts,
  PRICE_RANGES,
  type PriceKey,
  type SortKey,
} from "@/server/catalog";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "relevancia", label: "Mais vendidos" },
  { key: "menor-preco", label: "Menor preço" },
  { key: "maior-preco", label: "Maior preço" },
  { key: "avaliacao", label: "Mais bem avaliados" },
];

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "moletons", label: "Moletons" },
  { key: "camisetas", label: "Camisetas" },
  { key: "calcas", label: "Calças" },
  { key: "jaquetas", label: "Jaquetas" },
];
const CATEGORY_PAGES = new Set<string>(CATEGORIES.map((c) => c.key));

type Query = { ordem: SortKey; categoria?: Category; tamanho: string[]; cor: string[]; preco?: PriceKey };

function readQuery(sp: Record<string, string | string[] | undefined>): Query {
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : sp[k]) as string | undefined;
  const list = (k: string) =>
    (one(k) ?? "")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  return {
    ordem: SORTS.find((s) => s.key === one("ordem"))?.key ?? "relevancia",
    categoria: CATEGORIES.find((c) => c.key === one("categoria"))?.key,
    tamanho: list("tamanho"),
    cor: list("cor"),
    preco: PRICE_RANGES.find((r) => r.key === one("preco"))?.key,
  };
}

function toHref(slug: string, q: Query) {
  const params = new URLSearchParams();
  if (q.categoria) params.set("categoria", q.categoria);
  if (q.tamanho.length) params.set("tamanho", q.tamanho.join(","));
  if (q.cor.length) params.set("cor", q.cor.join(","));
  if (q.preco) params.set("preco", q.preco);
  if (q.ordem !== "relevancia") params.set("ordem", q.ordem);
  const qs = params.toString();
  return `/c/${slug}${qs ? `?${qs}` : ""}`;
}

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

export function generateStaticParams() {
  return Object.keys(COLLECTIONS).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/c/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  if (!isCollection(slug)) return {};
  const title = COLLECTIONS[slug].title;
  return {
    title,
    description: `${title} da Dream Store: streetwear com 5% off no Pix, 10x sem juros e troca grátis em 30 dias.`,
    alternates: { canonical: `/c/${slug}` },
  };
}

export default async function CollectionPage(props: PageProps<"/c/[slug]">) {
  const { slug } = await props.params;
  if (!isCollection(slug)) notFound();
  const q = readQuery(await props.searchParams);
  const isCategoryPage = CATEGORY_PAGES.has(slug);
  const active = {
    collection: slug,
    category: isCategoryPage ? undefined : q.categoria,
    sizes: q.tamanho,
    colors: q.cor,
    price: q.preco,
  };
  const products = listProducts({ ...active, sort: q.ordem });
  const facets = facetsFor(active);
  const activeCount = q.tamanho.length + q.cor.length + (q.preco ? 1 : 0) + (q.categoria && !isCategoryPage ? 1 : 0);
  const clearHref = toHref(slug, { ordem: q.ordem, tamanho: [], cor: [] });

  const filters = (
    <div className="space-y-8">
      {!isCategoryPage && (
        <FilterGroup title="Categoria">
          <ul className="space-y-1">
            {[{ key: undefined, label: "Tudo" }, ...CATEGORIES].map((c) => (
              <li key={c.label}>
                <Link
                  href={toHref(slug, { ...q, categoria: c.key })}
                  aria-current={q.categoria === c.key ? "true" : undefined}
                  className={cn("block py-1 hover:text-ink", q.categoria === c.key ? "font-medium" : "text-muted")}
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </FilterGroup>
      )}

      <FilterGroup title="Tamanho">
        <ul className="grid grid-cols-3 gap-2">
          {facets.sizes.map((s) => {
            const on = q.tamanho.includes(s.label);
            return (
              <li key={s.label}>
                <FilterLink
                  href={toHref(slug, { ...q, tamanho: toggle(q.tamanho, s.label) })}
                  disabled={!on && s.count === 0}
                  aria-label={`Tamanho ${s.label}${on ? ", selecionado" : ""}`}
                  className={cn(
                    "grid h-11 place-items-center rounded-lg border text-sm font-medium transition-colors",
                    on ? "border-ink bg-ink text-white" : "border-line hover:border-ink",
                  )}
                >
                  {s.label}
                </FilterLink>
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      <FilterGroup title="Cor">
        <ul className="grid grid-cols-3 gap-x-2 gap-y-4">
          {facets.colors.map((c) => {
            const on = q.cor.includes(c.name);
            return (
              <li key={c.name}>
                <FilterLink
                  href={toHref(slug, { ...q, cor: toggle(q.cor, c.name) })}
                  disabled={!on && c.count === 0}
                  className="group flex flex-col items-center gap-1.5 text-center text-xs"
                >
                  <span
                    className={cn(
                      "grid size-8 place-items-center rounded-full border ring-offset-2 transition-shadow",
                      on ? "ring-2 ring-ink" : "border-line group-hover:ring-1 group-hover:ring-ink",
                    )}
                    style={{ backgroundColor: c.hex }}
                  >
                    {on && <CheckIcon size={14} className={isLight(c.hex) ? "text-ink" : "text-white"} aria-hidden />}
                  </span>
                  {c.name}
                  {on && <span className="sr-only">, selecionada</span>}
                </FilterLink>
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      <FilterGroup title="Preço">
        <ul className="space-y-1">
          {facets.prices.map((r) => {
            const on = q.preco === r.key;
            return (
              <li key={r.key}>
                <FilterLink
                  href={toHref(slug, { ...q, preco: on ? undefined : r.key })}
                  disabled={!on && r.count === 0}
                  className="flex items-center gap-3 py-1"
                >
                  <span
                    className={cn(
                      "grid size-5 place-items-center rounded border",
                      on ? "border-ink bg-ink text-white" : "border-muted",
                    )}
                    aria-hidden
                  >
                    {on && <CheckIcon size={12} />}
                  </span>
                  {r.label} <span className="text-muted">({r.count})</span>
                  {on && <span className="sr-only">, selecionado</span>}
                </FilterLink>
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      {activeCount > 0 && (
        <Link href={clearHref} className="inline-block font-medium underline underline-offset-4">
          Limpar filtros ({activeCount})
        </Link>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-screen-2xl px-4 pt-8 md:px-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-medium">
            {COLLECTIONS[slug].title} <span className="text-muted">({products.length})</span>
          </h1>
          {slug === "outlet" && <p className="mt-1 text-muted">Peças com desconto enquanto durar o estoque.</p>}
        </div>
        <nav aria-label="Ordenar" className="-mx-4 scrollbar-none flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          {SORTS.map((s) => (
            <Link
              key={s.key}
              href={toHref(slug, { ...q, ordem: s.key })}
              aria-current={s.key === q.ordem ? "true" : undefined}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                s.key === q.ordem ? "border-ink bg-ink text-white" : "border-line hover:border-ink",
              )}
            >
              {s.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
        {/* Filtros: barra lateral fixa no desktop, painel recolhível no celular */}
        <aside aria-label="Filtros" className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pb-8">{filters}</div>
        </aside>
        <details className="group rounded-2xl border border-line lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-medium">
            Filtros{activeCount > 0 && ` (${activeCount})`}
            <CaretDownIcon size={18} className="transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <div className="border-t border-line px-5 py-6">{filters}</div>
        </details>

        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg font-medium">Nenhuma peça com esses filtros.</p>
            <p className="mt-1 text-muted">Tire um filtro ou veja a coleção completa.</p>
            <Link href={clearHref} className="mt-4 inline-block font-medium underline underline-offset-4">
              Limpar filtros
            </Link>
          </div>
        ) : (
          <section aria-labelledby="produtos">
            <h2 id="produtos" className="sr-only">
              Produtos
            </h2>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-10 xl:grid-cols-3">
              {products.map((p, i) => (
                <li key={p.slug}>
                  <ProductCard
                    product={p}
                    priority={i < 2}
                    sizes="(min-width: 1280px) 30vw, (min-width: 1024px) 40vw, 50vw"
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

/** Link de filtro; sem resultados vira texto desativado (fora da ordem de tabulação). */
function FilterLink({
  href,
  disabled,
  className,
  children,
  ...rest
}: { href: string; disabled: boolean; className?: string; children: React.ReactNode } & React.AriaAttributes) {
  if (disabled) {
    return (
      <span aria-disabled="true" className={cn(className, "cursor-not-allowed opacity-35")} {...rest}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-medium">{title}</h2>
      {children}
    </section>
  );
}

function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 160;
}
