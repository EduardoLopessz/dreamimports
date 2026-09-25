import Link from "next/link";
import { Logo } from "@/components/logo";
import { CartButton } from "./cart-button";
import { FavoritesLink } from "./favorites-link";
import { MainNav } from "./main-nav";
import { MobileMenu } from "./mobile-menu";
import { SearchDialog } from "./search-dialog";

export const NAV_LINKS = [
  { href: "/c/lancamentos", label: "Lançamentos" },
  { href: "/c/masculino", label: "Masculino" },
  { href: "/c/feminino", label: "Feminino" },
  { href: "/c/unissex", label: "Unissex" },
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
        <div className="mx-auto grid h-16 max-w-screen-2xl grid-cols-[auto_1fr] lg:grid-cols-[1fr_auto_1fr] items-center px-4 md:px-12">
          <Logo />
          <MainNav links={NAV_LINKS} />
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
