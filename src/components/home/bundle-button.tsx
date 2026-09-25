"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem } from "@/store/cart";

export type BundleItem = Omit<CartItem, "quantity">;

export function BundleButton({ items }: { items: BundleItem[] }) {
  const add = useCart((s) => s.add);
  return (
    <Button
      onClick={() => {
        items.forEach((i) => add({ ...i, name: `${i.name} (look)` }));
        toast.success("Look adicionado à sacola com 15% de desconto.");
      }}
    >
      Adicionar o look à sacola
    </Button>
  );
}
