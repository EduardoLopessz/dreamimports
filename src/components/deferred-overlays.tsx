"use client";

import dynamic from "next/dynamic";

// Sacola lateral e aviso de compra recente não aparecem no primeiro paint:
// carregam depois, fora do caminho crítico.
const CartDrawer = dynamic(() => import("@/components/cart/cart-drawer").then((m) => m.CartDrawer), { ssr: false });
const SocialProof = dynamic(() => import("@/components/social-proof").then((m) => m.SocialProof), { ssr: false });

export function DeferredOverlays() {
  return (
    <>
      <CartDrawer />
      <SocialProof />
    </>
  );
}
