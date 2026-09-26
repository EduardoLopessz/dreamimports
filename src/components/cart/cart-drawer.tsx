"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import * as Dialog from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { HandbagIcon, MinusIcon, PlusIcon, TruckIcon, XIcon } from "@/components/icons";
import { Photo } from "@/components/photo";
import { Button, ButtonLink } from "@/components/ui/button";
import { useTRPC } from "@/lib/trpc";
import { FREE_SHIPPING_CENTS, formatPrice, installment, pixPrice } from "@/lib/utils";
import { cartSubtotal, itemKey, useCart } from "@/store/cart";

const COUPONS: Record<string, number> = { DREAM10: 0.1 };
const UPSELL_SLUG = "camiseta-pixel-heavy";

export function CartDrawer() {
  const open = useCart((s) => s.open);
  const setOpen = useCart((s) => s.setOpen);
  const items = useCart((s) => s.items);
  const subtotal = useCart(cartSubtotal);
  const setQuantity = useCart((s) => s.setQuantity);
  const add = useCart((s) => s.add);
  const [listRef] = useAutoAnimate<HTMLUListElement>();

  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const trpc = useTRPC();
  const hasUpsell = items.some((i) => i.slug === UPSELL_SLUG);
  const { data: upsell } = useQuery({ ...trpc.product.queryOptions({ slug: UPSELL_SLUG }), enabled: open && !hasUpsell });

  const discount = coupon ? Math.round(subtotal * COUPONS[coupon]) : 0;
  const total = subtotal - discount;
  const missing = Math.max(FREE_SHIPPING_CENTS - total, 0);
  const progress = Math.min(total / FREE_SHIPPING_CENTS, 1);

  function applyCoupon(e: React.FormEvent) {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return setCouponError("Digite um cupom.");
    if (!(code in COUPONS)) return setCouponError(`O cupom ${code} não existe ou expirou.`);
    setCoupon(code);
    setCouponError(null);
    toast.success(`Cupom ${code} aplicado: 10% de desconto.`);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.aside
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              >
                <div className="flex items-center justify-between px-6 pt-6">
                  <Dialog.Title className="text-2xl font-medium">
                    Sacola{items.length > 0 && <span className="text-muted"> ({items.reduce((n, i) => n + i.quantity, 0)})</span>}
                  </Dialog.Title>
                  <Dialog.Close className="grid size-10 place-items-center rounded-full hover:bg-surface" aria-label="Fechar sacola">
                    <XIcon size={24} />
                  </Dialog.Close>
                </div>

                {items.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                    <HandbagIcon size={48} className="text-muted" />
                    <p className="text-lg font-medium">Sua sacola está vazia</p>
                    <p className="text-muted">Os drops da semana acabam rápido. Comece pelos mais vendidos.</p>
                    <ButtonLink href="/c/lancamentos" onClick={() => setOpen(false)}>
                      Ver lançamentos
                    </ButtonLink>
                  </div>
                ) : (
                  <>
                    <div className="mx-6 mt-4 rounded-2xl bg-surface p-4">
                      <p className="flex items-center gap-2 text-sm font-medium">
                        <TruckIcon size={20} />
                        {missing > 0 ? (
                          <>Faltam {formatPrice(missing)} para o frete grátis</>
                        ) : (
                          <>Você ganhou frete grátis</>
                        )}
                      </p>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso para o frete grátis">
                        <motion.div
                          className="h-full rounded-full bg-pix"
                          initial={false}
                          animate={{ width: `${progress * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6">
                      <ul ref={listRef} className="divide-y divide-line">
                        {items.map((item) => {
                          const key = itemKey(item);
                          return (
                            <li key={key} className="flex gap-4 py-5">
                              <Link href={`/produto/${item.slug}`} onClick={() => setOpen(false)} className="shrink-0">
                                <Photo image={{ pexelsId: item.imageId, alt: item.imageAlt }} sizes="96px" className="size-24" />
                              </Link>
                              <div className="flex flex-1 flex-col">
                                <div className="flex justify-between gap-2">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="font-medium">{formatPrice(item.priceCents * item.quantity)}</p>
                                </div>
                                <p className="text-sm text-muted">
                                  {item.color}, tamanho {item.size}
                                </p>
                                <div className="mt-auto flex items-center gap-1 self-start rounded-full border border-line">
                                  <button
                                    onClick={() => setQuantity(key, item.quantity - 1)}
                                    className="grid size-9 place-items-center rounded-full hover:bg-surface"
                                    aria-label={item.quantity === 1 ? `Remover ${item.name}` : `Diminuir quantidade de ${item.name}`}
                                  >
                                    <MinusIcon size={16} />
                                  </button>
                                  <span className="w-5 text-center text-sm font-medium" aria-live="polite">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => setQuantity(key, item.quantity + 1)}
                                    className="grid size-9 place-items-center rounded-full hover:bg-surface"
                                    aria-label={`Aumentar quantidade de ${item.name}`}
                                  >
                                    <PlusIcon size={16} />
                                  </button>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>

                      {upsell && !hasUpsell && (
                        <div className="mb-4 rounded-2xl border border-line p-4">
                          <p className="text-sm font-medium">Complete o look</p>
                          <div className="mt-3 flex items-center gap-3">
                            <Photo image={upsell.image} sizes="64px" className="size-16 shrink-0 rounded-lg" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{upsell.name}</p>
                              <p className="text-sm text-muted">{formatPrice(upsell.priceCents)}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() =>
                                add({
                                  slug: upsell.slug,
                                  name: upsell.name,
                                  subtitle: upsell.subtitle,
                                  priceCents: upsell.priceCents,
                                  imageId: upsell.image.pexelsId,
                                  imageAlt: upsell.image.alt,
                                  size: "M",
                                  color: "Branco",
                                })
                              }
                            >
                              Incluir
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-line px-6 pt-4 pb-6">
                      <form onSubmit={applyCoupon} className="flex gap-2" noValidate>
                        <label className="sr-only" htmlFor="cupom">
                          Cupom de desconto
                        </label>
                        <input
                          id="cupom"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="Cupom de desconto"
                          aria-invalid={couponError ? true : undefined}
                          aria-describedby={couponError ? "cupom-erro" : undefined}
                          className="h-11 flex-1 rounded-full border border-line px-4 uppercase outline-none placeholder:normal-case focus:border-ink"
                        />
                        <Button type="submit" variant="secondary" size="sm" className="h-11">
                          Aplicar
                        </Button>
                      </form>
                      {couponError && (
                        <p id="cupom-erro" className="mt-2 text-sm text-sale">
                          {couponError}
                        </p>
                      )}

                      <dl className="mt-4 space-y-1 text-base">
                        <div className="flex justify-between">
                          <dt className="text-muted">Subtotal</dt>
                          <dd>{formatPrice(subtotal)}</dd>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-pix">
                            <dt>Cupom {coupon}</dt>
                            <dd>−{formatPrice(discount)}</dd>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <dt className="text-muted">Frete</dt>
                          <dd>{missing > 0 ? "Calculado no checkout" : "Grátis"}</dd>
                        </div>
                        <div className="flex justify-between pt-2 text-lg font-medium">
                          <dt>Total</dt>
                          <dd>{formatPrice(total)}</dd>
                        </div>
                        <p className="text-right text-sm font-medium text-pix">
                          {formatPrice(pixPrice(total))} no Pix
                        </p>
                        <p className="text-right text-sm text-muted">ou 10x de {formatPrice(installment(total))} sem juros</p>
                      </dl>

                      <Button
                        size="lg"
                        className="mt-4 w-full"
                        onClick={() => toast("Checkout de demonstração", { description: "O pagamento será conectado na próxima etapa. Nenhuma cobrança foi feita." })}
                      >
                        Finalizar compra
                      </Button>
                    </div>
                  </>
                )}
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
