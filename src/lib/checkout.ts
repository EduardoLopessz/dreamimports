import { FREE_SHIPPING_CENTS, INSTALLMENTS, pixPrice } from "./utils";

export type ShippingKey = "economica" | "expressa";

export const SHIPPING: Record<ShippingKey, { label: string; days: string; priceCents: (total: number) => number }> = {
  economica: {
    label: "Econômica",
    days: "5 a 8 dias úteis",
    priceCents: (total) => (total >= FREE_SHIPPING_CENTS ? 0 : 1990),
  },
  expressa: { label: "Expressa", days: "2 a 4 dias úteis", priceCents: () => 2990 },
};

export type PaymentMethod = "pix" | "cartao";

/** Totais da sacola antes do frete. Mesma base usada pelo checkout em `orderTotals`. */
export function cartSummary(subtotal: number, discount: number) {
  const goods = subtotal - discount;
  return {
    goods,
    pixGoods: pixPrice(goods),
    missingForFreeShipping: Math.max(FREE_SHIPPING_CENTS - goods, 0),
    freeShippingProgress: Math.min(goods / FREE_SHIPPING_CENTS, 1),
  };
}

export function orderTotals(subtotal: number, discount: number, shipping: ShippingKey, payment: PaymentMethod) {
  const { goods } = cartSummary(subtotal, discount);
  const freight = SHIPPING[shipping].priceCents(goods);
  const total = goods + freight;
  // Desconto do Pix vale sobre os produtos, não sobre o frete.
  const pixTotal = pixPrice(goods) + freight;
  return { goods, freight, total, pixTotal, charged: payment === "pix" ? pixTotal : total };
}

export const onlyDigits = (v: string) => v.replace(/\D/g, "");

export function maskCep(v: string) {
  const d = onlyDigits(v).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export function maskPhone(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
}

export function maskCard(v: string) {
  return onlyDigits(v)
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function maskExpiry(v: string) {
  const d = onlyDigits(v).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

/** Algoritmo de Luhn: pega erros de digitação no número do cartão. */
export function luhn(number: string) {
  const d = onlyDigits(number);
  if (d.length < 13) return false;
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

export function expiryValid(v: string, now = new Date()) {
  const m = /^(\d{2})\/(\d{2})$/.exec(v);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const UFS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

export const installmentOptions = (total: number) =>
  Array.from({ length: INSTALLMENTS }, (_, i) => ({ n: i + 1, value: Math.round(total / (i + 1)) }));

export type Address = {
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  uf: string;
};

/** Endereço pelo CEP (ViaCEP, API pública). Retorna null se o CEP não existir. */
export async function lookupCep(cep: string, signal?: AbortSignal): Promise<Partial<Address> | null> {
  const res = await fetch(`https://viacep.com.br/ws/${onlyDigits(cep)}/json/`, { signal });
  if (!res.ok) throw new Error(`ViaCEP respondeu ${res.status}`);
  const data = (await res.json()) as {
    erro?: boolean;
    logradouro?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
  };
  if (data.erro) return null;
  return { street: data.logradouro ?? "", district: data.bairro ?? "", city: data.localidade ?? "", uf: data.uf ?? "" };
}

export type SavedOrder = {
  id: string;
  createdAt: string;
  email: string;
  name: string;
  address: Address;
  shipping: ShippingKey;
  payment: PaymentMethod;
  installments: number;
  items: {
    name: string;
    size: string;
    color: string;
    quantity: number;
    priceCents: number;
    imageId: string;
    imageAlt: string;
  }[];
  totals: ReturnType<typeof orderTotals> & { subtotal: number; discount: number; coupon: string | null };
  /** true depois que a confirmação esvaziou a sacola (evita esvaziar de novo ao revisitar). */
  cartCleared?: boolean;
};

export const ORDER_KEY = "dream-last-order";

/** Número curto e legível do pedido (demonstração). */
export function newOrderStamp(now = new Date()) {
  return { id: `DS-${now.getTime().toString(36).toUpperCase().slice(-6)}`, createdAt: now.toISOString() };
}
