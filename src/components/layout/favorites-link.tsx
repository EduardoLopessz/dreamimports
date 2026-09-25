"use client";

import Link from "next/link";
import { HeartIcon } from "@/components/icons";
import { useFavorites } from "@/store/cart";

export function FavoritesLink() {
  const count = useFavorites((s) => s.slugs.length);
  return (
    <Link
      href="/favoritos"
      className="relative hidden size-10 place-items-center rounded-full hover:bg-surface sm:grid"
      aria-label={`Favoritos${count ? `, ${count}` : ""}`}
    >
      <HeartIcon size={24} />
      {count > 0 && <span className="absolute top-2 right-2 size-2 rounded-full bg-accent" aria-hidden />}
    </Link>
  );
}
