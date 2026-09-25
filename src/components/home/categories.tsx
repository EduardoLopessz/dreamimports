import Link from "next/link";
import { CATEGORY_COVERS } from "@/db/data";
import { Photo } from "@/components/photo";
import { buttonVariants } from "@/components/ui/button";
import { Carousel } from "./carousel";

const CATEGORIES = [
  { slug: "moletons", label: "Moletons" },
  { slug: "camisetas", label: "Camisetas" },
  { slug: "calcas", label: "Calças" },
  { slug: "jaquetas", label: "Jaquetas" },
] as const;

export function Categories() {
  return (
    <Carousel title="Compre por categoria" id="categorias" itemClassName="w-[70vw] sm:w-[40vw] lg:w-[calc((100%-3*12px)/4)]">
      {CATEGORIES.map((c) => (
        <Link key={c.slug} href={`/c/${c.slug}`} className="group relative block">
          <Photo
            image={CATEGORY_COVERS[c.slug]}
            sizes="(min-width: 1024px) 25vw, 70vw"
            className="aspect-[3/4]"
            imgClassName="transition-transform duration-1000 ease-fluid group-hover:scale-[1.03]"
          />
          <span className={buttonVariants({ variant: "light", size: "sm", className: "absolute bottom-6 left-6" })}>{c.label}</span>
        </Link>
      ))}
    </Carousel>
  );
}
