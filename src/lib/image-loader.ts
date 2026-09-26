"use client";

/**
 * Loader do next/image: pede cada tamanho direto ao CDN do Pexels em vez do otimizador da Vercel.
 * Medido em produção: o otimizador levava ~1,5 s na primeira vez de cada tamanho; o CDN do Pexels
 * responde em ~20-30 ms quando já tem a foto e ~0,3-0,4 s quando não tem, e ainda manda AVIF
 * (828px: 42 KB) para quem aceita.
 */
export default function pexelsLoader({ src, width }: { src: string; width: number }) {
  const url = new URL(src);
  if (url.hostname !== "images.pexels.com") return src;
  url.searchParams.set("w", String(width));
  return url.toString();
}
