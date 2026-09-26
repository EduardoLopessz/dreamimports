import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** Valores em centavos para evitar erro de ponto flutuante. */
export function formatPrice(cents: number) {
  return brl.format(cents / 100);
}

export const PIX_DISCOUNT = 0.05;
export const INSTALLMENTS = 10;
export const FREE_SHIPPING_CENTS = 29900;

export function pixPrice(cents: number) {
  return Math.round(cents * (1 - PIX_DISCOUNT));
}

export function installment(cents: number) {
  return Math.round(cents / INSTALLMENTS);
}

export function discountPercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round((1 - price / compareAt) * 100);
}

/**
 * Foto no CDN do Pexels, que redimensiona pelo `w` e entrega AVIF/WebP conforme o navegador.
 * O next/image troca o `w` para cada tamanho do srcset (ver src/lib/image-loader.ts);
 * 1920px é o padrão para quem usa a URL direto (Open Graph, dados estruturados).
 */
export function pexels(id: string, width = 1920) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}
