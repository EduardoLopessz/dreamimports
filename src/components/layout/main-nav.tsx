"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainNav({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Principal" className="hidden lg:block">
      <ul className="flex items-center gap-2">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative block px-3 py-5 text-base font-medium after:absolute after:inset-x-3 after:bottom-3 after:h-0.5 after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-500 after:ease-fluid hover:after:scale-x-100",
                  active && "after:scale-x-100",
                  l.label === "Outlet" && "text-sale",
                )}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
