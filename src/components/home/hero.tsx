import { EDITORIAL } from "@/db/data";
import { Photo } from "@/components/photo";
import { ButtonLink } from "@/components/ui/button";
import { Countdown } from "./countdown";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="mx-auto max-w-screen-2xl md:px-12">
      <Photo
          image={EDITORIAL.hero}
          priority
          quality={85}
          sizes="(min-width: 1536px) 1440px, 100vw"
          className="aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/10]"
          imgClassName="object-[center_30%] animate-settle"
        />
      <div className="px-4 pt-10 text-center">
        <div className="animate-rise [animation-delay:100ms]">
          <p className="font-medium">Drop Nebula</p>
        </div>
        <div className="animate-rise [animation-delay:180ms]">
          <h1 id="hero-title" className="display mt-2 text-6xl sm:text-8xl lg:text-9xl">
            Vista seu sonho
          </h1>
        </div>
        <div className="animate-rise [animation-delay:260ms]">
          <p className="mx-auto mt-4 max-w-xl">
            Moletons pesados, camisetas de algodão grosso e calças cargo. Peças limitadas, só até domingo.
          </p>
        </div>
        <div className="animate-rise [animation-delay:340ms]">
          <div className="mt-6">
            <Countdown />
          </div>
          <div className="mt-6 flex justify-center gap-2">
            <ButtonLink href="/c/lancamentos">Comprar o drop</ButtonLink>
            <ButtonLink href="#look" variant="secondary">
              Ver o look
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
