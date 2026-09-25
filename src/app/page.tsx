import { Carousel } from "@/components/home/carousel";
import { Categories } from "@/components/home/categories";
import { Featured } from "@/components/home/featured";
import { Hero } from "@/components/home/hero";
import { LookBanner } from "@/components/home/look-banner";
import { Membership } from "@/components/home/membership";
import { Tagline } from "@/components/home/tagline";
import { ProductCard } from "@/components/product/product-card";
import { bestSellers } from "@/server/catalog";

export default function HomePage() {
  const products = bestSellers(8);
  return (
    <>
      <Hero />
      <Featured />
      <Carousel title="Os mais vendidos" id="mais-vendidos" link={{ href: "/c/lancamentos", label: "Ver tudo" }}>
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 45vw, 75vw" />
        ))}
      </Carousel>
      <Tagline />
      <LookBanner />
      <Categories />
      <Membership />
    </>
  );
}
