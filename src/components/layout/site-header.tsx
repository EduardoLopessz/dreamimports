import Link from "next/link";
import { Logo } from "@/components/logo";
import { CartButton } from "./cart-button";
import { FavoritesLink } from "./favorites-link";
import { PRODUCTS } from "@/db/data";
import { discountPercent } from "@/lib/utils";
import { MainNav, type MegaPanel } from "./main-nav";
import { MobileMenu } from "./mobile-menu";
import { SearchDialog } from "./search-dialog";

export const NAV_LINKS = [
  { href: "/c/lancamentos", label: "Lançamentos" },
  { href: "/c/masculino", label: "Masculino" },
  { href: "/c/feminino", label: "Feminino" },
  { href: "/c/unissex", label: "Unissex" },
  { href: "/c/outlet", label: "Outlet" },
];

const cargo = PRODUCTS.find((p) => p.slug === "calca-cargo-orbit")!;
const cargoOff = discountPercent(cargo.priceCents, cargo.compareAtCents ?? undefined);

const GENDER_PROMO = {
  masculino: {
    title: `Calça Cargo Orbit com ${cargoOff}% off`,
    href: "/produto/calca-cargo-orbit",
    image: PRODUCTS.find((p) => p.slug === "calca-cargo-orbit")!.images[0],
  },
  feminino: {
    title: "Moletom Dusk acabou de chegar",
    href: "/produto/moletom-dusk",
    image: PRODUCTS.find((p) => p.slug === "moletom-dusk")!.images[0],
  },
  unissex: {
    title: "Moletom Nebula, o mais vendido",
    href: "/produto/moletom-nebula-oversized",
    image: PRODUCTS.find((p) => p.slug === "moletom-nebula-oversized")!.images[0],
  },
};

function genderPanel(slug: keyof typeof GENDER_PROMO, label: string): MegaPanel {
  const base = `/c/${slug}`;
  return {
    href: base,
    label,
    panel: {
      columns: [
        {
          title: "Destaques",
          links: [
            { href: base, label: `Tudo em ${label}` },
            { href: "/c/lancamentos", label: "Lançamentos" },
            { href: `${base}?ordem=avaliacao`, label: "Mais bem avaliados" },
            { href: "/c/outlet", label: "Outlet" },
          ],
        },
        {
          title: "Roupas",
          links: [
            { href: `${base}?categoria=moletons`, label: "Moletons" },
            { href: `${base}?categoria=camisetas`, label: "Camisetas" },
            { href: `${base}?categoria=calcas`, label: "Calças" },
            { href: `${base}?categoria=jaquetas`, label: "Jaquetas" },
          ],
        },
        {
          title: "Ajuda",
          links: [
            { href: "/ajuda#tamanhos", label: "Guia de tamanhos" },
            { href: "/ajuda#trocas", label: "Trocas grátis em 30 dias" },
            { href: "/ajuda#entrega", label: "Prazos de entrega" },
          ],
        },
      ],
      promo: GENDER_PROMO[slug],
    },
  };
}

const MEGA_ITEMS: MegaPanel[] = [
  { href: "/c/lancamentos", label: "Lançamentos" },
  genderPanel("masculino", "Masculino"),
  genderPanel("feminino", "Feminino"),
  genderPanel("unissex", "Unissex"),
  { href: "/c/outlet", label: "Outlet" },
];

export function SiteHeader() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-50 bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Pular para o conteúdo
      </a>

      {/* Barra utilitária */}
      <div className="hidden bg-surface md:block">
        <div className="mx-auto flex h-9 max-w-screen-2xl items-center justify-end gap-3 px-12 text-xs font-medium">
          <Link href="/ajuda#pedido" className="hover:text-muted">
            Rastrear pedido
          </Link>
          <span aria-hidden>|</span>
          <Link href="/ajuda" className="hover:text-muted">
            Ajuda
          </Link>
          <span aria-hidden>|</span>
          <Link href="/#membros" className="hover:text-muted">
            Cadastre-se
          </Link>
        </div>
      </div>

      {/* Navegação principal (fixa no topo ao rolar) */}
      <header className="sticky top-0 z-40 bg-white">
        <div className="mx-auto grid h-16 max-w-screen-2xl grid-cols-[auto_1fr] items-center px-4 md:px-12 lg:grid-cols-[1fr_auto_1fr]">
          <Logo />
          <MainNav items={MEGA_ITEMS} />
          <div className="flex items-center justify-end gap-1">
            <SearchDialog />
            <FavoritesLink />
            <CartButton />
            <MobileMenu links={NAV_LINKS} />
          </div>
        </div>
      </header>
    </>
  );
}
