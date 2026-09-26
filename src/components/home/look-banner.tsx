import { EDITORIAL } from "@/db/data";
import { Photo } from "@/components/photo";
import { getProduct } from "@/server/catalog";
import { formatPrice } from "@/lib/utils";
import { BundleButton, type BundleItem } from "./bundle-button";
import { Reveal } from "./reveal";

const BUNDLE_DISCOUNT = 0.15;
const LOOK = [
  { slug: "moletom-nebula-oversized", size: "G", color: "Preto" },
  { slug: "calca-cargo-orbit", size: "G", color: "Preto" },
  { slug: "camiseta-pixel-heavy", size: "G", color: "Preto" },
];

export function LookBanner() {
  const items: BundleItem[] = LOOK.flatMap((l) => {
    const p = getProduct(l.slug);
    if (!p) return [];
    return [
      {
        slug: p.slug,
        name: p.name,
        subtitle: p.subtitle,
        priceCents: Math.round(p.priceCents * (1 - BUNDLE_DISCOUNT)),
        imageId: p.images[0].pexelsId,
        imageAlt: p.images[0].alt,
        size: l.size,
        color: l.color,
      },
    ];
  });
  const full = LOOK.reduce((sum, l) => sum + (getProduct(l.slug)?.priceCents ?? 0), 0);
  const total = items.reduce((sum, i) => sum + i.priceCents, 0);

  return (
    <section id="look" aria-labelledby="look-title" className="mx-auto mt-24 max-w-screen-2xl scroll-mt-20 md:px-12">
      <h2 className="px-4 text-2xl font-medium md:px-0">Look Nebula</h2>
      <Reveal variant="image" className="mt-6">
        <Photo image={EDITORIAL.look} sizes="(min-width: 1536px) 1440px, 100vw" className="aspect-[4/5] sm:aspect-[16/8]" imgClassName="object-[center_25%]" />
      </Reveal>
      <div className="px-4 pt-10 text-center">
        <Reveal>
          <p id="look-title" className="display text-6xl sm:text-8xl">
            Monte o look
          </p>
          <p className="mx-auto mt-4 max-w-xl">
            Moletom Nebula, Calça Cargo Orbit e Camiseta Pixel Heavy juntos por{" "}
            <strong className="font-medium">{formatPrice(total)}</strong>.{" "}
            <span className="text-pix">Você economiza {formatPrice(full - total)}.</span>
          </p>
          <div className="mt-6 flex justify-center">
            <BundleButton items={items} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
