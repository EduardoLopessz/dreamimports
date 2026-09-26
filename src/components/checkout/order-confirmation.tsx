"use client";

import { useEffect, useSyncExternalStore } from "react";
import { CheckIcon, PackageIcon } from "@/components/icons";
import { Photo } from "@/components/photo";
import { ButtonLink } from "@/components/ui/button";
import { ORDER_KEY, SHIPPING, type SavedOrder } from "@/lib/checkout";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/cart";

function readOrder(): string | null {
  try {
    return sessionStorage.getItem(ORDER_KEY);
  } catch {
    return null;
  }
}

function parseOrder(raw: string | null): SavedOrder | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SavedOrder;
  } catch {
    return null; // dado corrompido: mostra só o número do pedido
  }
}

export function OrderConfirmation({ id }: { id: string }) {
  // sessionStorage só existe no navegador; no servidor fica null.
  const raw = useSyncExternalStore(
    () => () => {},
    readOrder,
    () => null,
  );
  const order = parseOrder(raw);
  const match = order?.id === id ? order : null;
  const pendingClear = match && !match.cartCleared ? raw : null;

  // A compra foi concluída: esvazia a sacola uma única vez, com a confirmação já na tela.
  useEffect(() => {
    if (!pendingClear) return;
    useCart.getState().clear();
    try {
      sessionStorage.setItem(ORDER_KEY, JSON.stringify({ ...JSON.parse(pendingClear), cartCleared: true }));
    } catch {
      /* sem sessionStorage não há o que marcar */
    }
  }, [pendingClear]);

  return (
    <div className="mx-auto max-w-3xl px-4 pt-12">
      <span className="grid size-14 place-items-center rounded-full bg-pix text-white" aria-hidden>
        <CheckIcon size={28} weight="bold" />
      </span>
      <h1 className="mt-6 display text-5xl sm:text-6xl">Pedido confirmado</h1>
      <p className="mt-3 text-lg">
        Número do pedido: <strong className="font-medium">{id}</strong>
      </p>
      <p className="mt-2 rounded-xl bg-surface px-4 py-3 text-sm text-muted">
        Loja de demonstração: este pedido é simulado e nenhum pagamento foi cobrado.
      </p>

      {match ? (
        <>
          <p className="mt-6 text-muted">
            Enviamos a confirmação para <strong className="font-medium text-ink">{match.email}</strong>.
          </p>

          {match.payment === "pix" && (
            <div className="mt-8 rounded-3xl border border-line p-6">
              <p className="text-lg font-medium">Pague {formatPrice(match.totals.pixTotal)} no Pix</p>
              <p className="mt-1 text-muted">
                Numa loja real, o QR Code e o código copia e cola aparecem aqui para você pagar pelo app do banco. O
                pedido é liberado assim que o pagamento cai.
              </p>
            </div>
          )}

          <div className="mt-8 grid gap-6 rounded-3xl bg-surface p-6 sm:grid-cols-2">
            <div>
              <p className="flex items-center gap-2 font-medium">
                <PackageIcon size={20} aria-hidden /> Entrega {SHIPPING[match.shipping].label.toLowerCase()}
              </p>
              <p className="mt-2 text-sm text-muted">
                {match.address.street}, {match.address.number}
                {match.address.complement && `, ${match.address.complement}`}
                <br />
                {match.address.district}, {match.address.city} ({match.address.uf})
                <br />
                CEP {match.address.cep}
              </p>
              <p className="mt-2 text-sm">Chega em {SHIPPING[match.shipping].days}.</p>
            </div>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd>{formatPrice(match.totals.subtotal)}</dd>
              </div>
              {match.totals.discount > 0 && (
                <div className="flex justify-between text-pix">
                  <dt>Cupom {match.totals.coupon}</dt>
                  <dd>−{formatPrice(match.totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted">Frete</dt>
                <dd>{match.totals.freight === 0 ? "Grátis" : formatPrice(match.totals.freight)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-base font-medium">
                <dt>{match.payment === "pix" ? "Total no Pix" : "Total no cartão"}</dt>
                <dd>{formatPrice(match.totals.charged)}</dd>
              </div>
              {match.payment === "cartao" && match.installments > 1 && (
                <p className="text-right text-muted">
                  {match.installments}x de {formatPrice(Math.round(match.totals.total / match.installments))}
                </p>
              )}
            </dl>
          </div>

          <ul className="mt-8 divide-y divide-line">
            {match.items.map((i, n) => (
              <li key={n} className="flex items-center gap-4 py-4">
                <Photo
                  image={{ pexelsId: i.imageId, alt: i.imageAlt }}
                  sizes="80px"
                  className="size-20 shrink-0 rounded-xl"
                />
                <div className="flex-1">
                  <p className="font-medium">{i.name}</p>
                  <p className="text-sm text-muted">
                    {i.color}, tamanho {i.size}, {i.quantity} un.
                  </p>
                </div>
                <p className="font-medium">{formatPrice(i.priceCents * i.quantity)}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-6 text-muted">Os detalhes deste pedido ficam salvos só no navegador em que ele foi feito.</p>
      )}

      <div className="mt-10 flex flex-wrap gap-2">
        <ButtonLink href="/c/lancamentos">Continuar comprando</ButtonLink>
        <ButtonLink href="/ajuda#pedido" variant="secondary">
          Como acompanhar o pedido
        </ButtonLink>
      </div>
    </div>
  );
}
