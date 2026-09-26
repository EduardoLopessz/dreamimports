import type { Metadata } from "next";
import { CATEGORY_COVERS, EDITORIAL, PRODUCTS } from "@/db/data";

export const metadata: Metadata = { title: "Créditos das fotos", robots: { index: false } };

export default function CreditsPage() {
  const all = [
    ...Object.values(EDITORIAL),
    ...Object.values(CATEGORY_COVERS),
    ...PRODUCTS.flatMap((p) => p.images),
  ];
  const unique = [...new Map(all.map((i) => [i.pexelsId, i])).values()];
  return (
    <div className="mx-auto max-w-3xl px-4 pt-10">
      <h1 className="text-2xl font-medium">Créditos das fotos</h1>
      <p className="mt-2 text-muted">
        Todas as fotos são do Pexels, sob a Licença Pexels (uso comercial livre). Obrigado aos fotógrafos.
      </p>
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {unique.map((img) => (
          <li key={img.pexelsId} className="flex justify-between gap-4 py-3 text-sm">
            <span>{img.alt}</span>
            <a
              href={`https://www.pexels.com/photo/${img.pexelsId}/`}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 underline underline-offset-2"
            >
              {img.author === "Pexels" ? "Ver no Pexels" : img.author}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
