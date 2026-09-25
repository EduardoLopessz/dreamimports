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

/** Link de download do Unsplash (redireciona para a imagem original). */
export function unsplash(id: string) {
  return `https://unsplash.com/photos/${id}/download?force=true&w=2400`;
}
