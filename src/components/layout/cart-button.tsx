"use client";

import { HandbagIcon } from "@/components/icons";
import { cartCount, useCart } from "@/store/cart";

export function CartButton() {
  const count = useCart(cartCount);
  const setOpen = useCart((s) => s.setOpen);
  return (
    <button
      onClick={() => setOpen(true)}
      className="relative grid size-10 place-items-center rounded-full hover:bg-surface"
      aria-label={count > 0 ? `Sacola, ${count} ${count === 1 ? "item" : "itens"}` : "Sacola vazia"}
    >
      <HandbagIcon size={24} />
      {count > 0 && (
        <span className="absolute top-1 right-0.5 grid size-4 place-items-center rounded-full bg-accent text-[10px] font-semibold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
