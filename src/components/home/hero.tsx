import { EDITORIAL } from "@/db/data";
import { Photo } from "@/components/photo";
import { ButtonLink } from "@/components/ui/button";
import { Countdown } from "./countdown";

/**
 * Capa em tela cheia com o título sobre a foto: o recado principal aparece
 * sem rolar, no celular e no desktop. A sombra de baixo garante o contraste do texto branco.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="mx-auto max-w-screen-2xl md:px-12">
      <div className="relative h-[calc(100svh-9.75rem)] max-h-[880px] min-h-[520px] overflow-hidden">
        <Photo
          image={EDITORIAL.hero}
          priority
          quality={85}
          sizes="(min-width: 1536px) 1440px, 100vw"
          className="absolute inset-0"
          imgClassName="animate-settle"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10 lg:p-14">
          <p className="animate-rise font-medium [animation-delay:100ms]">Drop Nebula, só até domingo</p>
          <h1
            id="hero-title"
            className="mt-3 animate-rise display text-6xl [animation-delay:180ms] sm:text-8xl lg:text-9xl"
          >
            Vista
            <br />
            seu sonho
          </h1>
          <p className="mt-4 hidden max-w-md animate-rise text-white/85 [animation-delay:260ms] sm:block">
            Moletons pesados, camisetas de algodão grosso e calças cargo em tiragem limitada.
          </p>
          <div className="mt-6 flex animate-rise flex-col gap-5 [animation-delay:340ms] lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <ButtonLink href="/c/lancamentos" variant="light" size="lg">
                Comprar o drop
              </ButtonLink>
              <ButtonLink
                href="#look"
                size="lg"
                className="border border-white/60 bg-transparent text-white hover:bg-white/15"
              >
                Ver o look
              </ButtonLink>
            </div>
            <div className="hidden sm:block">
              <Countdown tone="dark" />
            </div>
          </div>
        </div>
      </div>
      {/* No celular a contagem fica abaixo da foto, para não cobrir o rosto */}
      <div className="flex flex-col gap-2 px-4 pt-4 sm:hidden">
        <p className="text-sm font-medium">O drop termina em</p>
        <Countdown />
      </div>
    </section>
  );
}
