"use client";

import { motion } from "motion/react";
import { HeartIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/store/cart";

export function FavoriteButton({ slug, name, className }: { slug: string; name: string; className?: string }) {
  const active = useFavorites((s) => s.slugs.includes(slug));
  const toggle = useFavorites((s) => s.toggle);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggle(slug);
      }}
      aria-pressed={active}
      aria-label={active ? `Remover ${name} dos favoritos` : `Adicionar ${name} aos favoritos`}
      className={cn("grid size-10 place-items-center rounded-full bg-white transition-transform active:scale-90", className)}
    >
      <motion.span key={String(active)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, duration: 0.4 }}>
        <HeartIcon size={22} weight={active ? "fill" : "regular"} className={active ? "text-sale" : undefined} />
      </motion.span>
    </button>
  );
}
