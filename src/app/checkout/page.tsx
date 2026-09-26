import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = { title: "Finalizar compra", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 pt-8 md:px-12">
      <h1 className="display text-5xl sm:text-6xl">Finalizar compra</h1>
      <p className="mt-3 rounded-xl bg-surface px-4 py-3 text-sm text-muted">
        Loja de demonstração: o pedido é simulado e nenhum pagamento é cobrado.
      </p>
      <CheckoutForm />
    </div>
  );
}
