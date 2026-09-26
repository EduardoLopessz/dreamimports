import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/checkout/order-confirmation";

export const metadata: Metadata = { title: "Pedido confirmado", robots: { index: false } };

export default async function OrderPage(props: PageProps<"/pedido/[id]">) {
  const { id } = await props.params;
  return <OrderConfirmation id={id} />;
}
