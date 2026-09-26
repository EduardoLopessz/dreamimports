"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Photo } from "@/components/photo";
import type { ProductImage } from "@/db/schema";
import { cn } from "@/lib/utils";

export type MegaPanel = {
  href: string;
  label: string;
  /** Sem painel: vira link simples (Lançamentos, Outlet). */
  panel?: {
    columns: { title: string; links: { href: string; label: string }[] }[];
    promo: { href: string; title: string; image: Pick<ProductImage, "pexelsId" | "alt" | "focus"> };
  };
};

const itemClass =
  "relative block px-3 py-5 text-base font-medium after:absolute after:inset-x-3 after:bottom-3 after:h-0.5 after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-500 after:ease-fluid hover:after:scale-x-100 data-[state=open]:after:scale-x-100";

/** Menu principal com painéis grandes (mega menu), abertos por hover, clique ou teclado. */
export function MainNav({ items }: { items: MegaPanel[] }) {
  const pathname = usePathname();
  return (
    <NavigationMenu.Root aria-label="Principal" className="hidden lg:block" delayDuration={80}>
      <NavigationMenu.List className="flex items-center gap-2">
        {items.map((item) => {
          const active = pathname === item.href;
          const tone = item.label === "Outlet" ? "text-sale" : undefined;
          if (!item.panel) {
            return (
              <NavigationMenu.Item key={item.href}>
                <NavigationMenu.Link asChild active={active}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(itemClass, active && "after:scale-x-100", tone)}
                  >
                    {item.label}
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            );
          }
          return (
            <NavigationMenu.Item key={item.href}>
              {/* O gatilho é um link de verdade: o hover abre o painel e o clique leva à coleção
                  (funciona com ctrl+clique, "abrir em nova aba" e buscadores). */}
              <NavigationMenu.Trigger asChild>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(itemClass, active && "after:scale-x-100")}
                >
                  {item.label}
                </Link>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="mx-auto grid max-w-screen-2xl grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.3fr)] gap-10 px-12 pt-6 pb-12 data-[motion^=from-]:animate-rise">
                {item.panel.columns.map((col) => (
                  <div key={col.title}>
                    <p className="font-medium">{col.title}</p>
                    <ul className="mt-4 space-y-3">
                      {col.links.map((l) => (
                        <li key={l.href}>
                          <NavigationMenu.Link asChild>
                            <Link href={l.href} className="text-muted transition-colors hover:text-ink">
                              {l.label}
                            </Link>
                          </NavigationMenu.Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <NavigationMenu.Link asChild>
                  <Link href={item.panel.promo.href} className="group relative block overflow-hidden">
                    <Photo
                      image={item.panel.promo.image}
                      sizes="400px"
                      className="aspect-[4/3]"
                      imgClassName="transition-transform duration-1000 ease-fluid group-hover:scale-[1.04]"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-16 font-medium text-white">
                      {item.panel.promo.title}
                    </span>
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>
      <div className="absolute inset-x-0 top-full">
        <NavigationMenu.Viewport className="h-[var(--radix-navigation-menu-viewport-height)] overflow-hidden border-b border-line bg-white shadow-[0_24px_48px_-24px_rgba(17,17,17,0.18)] transition-[height] duration-300 ease-fluid" />
      </div>
    </NavigationMenu.Root>
  );
}
