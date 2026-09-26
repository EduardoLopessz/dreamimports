import Link from "next/link";
import { EDITORIAL } from "@/db/data";
import { Photo } from "@/components/photo";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "./reveal";

const ITEMS = [
  {
    image: EDITORIAL.colecao,
    eyebrow: "Coleção Nebula",
    title: "Streetwear feito para durar",
    cta: "Comprar coleção",
    href: "/c/lancamentos",
  },
  {
    image: EDITORIAL.feminino,
    eyebrow: "Feminino",
    title: "Oversized do seu jeito",
    cta: "Comprar feminino",
    href: "/c/feminino",
  },
];

export function Featured() {
  return (
    <section aria-labelledby="destaque" className="mx-auto mt-24 max-w-screen-2xl px-4 md:px-12">
      <h2 id="destaque" className="text-2xl font-medium">
        Em destaque
      </h2>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {ITEMS.map((item, i) => (
          <Reveal key={item.href} delay={i * 0.08}>
            <Link href={item.href} className="group relative block">
              <Photo
                image={item.image}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="aspect-[4/5]"
                imgClassName="transition-transform duration-1000 ease-fluid group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-8 pt-32 text-white md:p-12 md:pt-40">
                <p className="font-medium">{item.eyebrow}</p>
                <p className="mt-1 text-2xl font-medium">{item.title}</p>
                <span className={buttonVariants({ variant: "light", size: "sm", className: "mt-5" })}>{item.cta}</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
