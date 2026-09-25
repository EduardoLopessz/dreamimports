import { EDITORIAL } from "@/db/data";
import { Photo } from "@/components/photo";
import { JoinForm } from "./join-form";
import { Reveal } from "./reveal";

const PERKS = [
  { image: EDITORIAL.drops, title: "Acesso antecipado aos drops", text: "Compre 24 horas antes de todo mundo." },
  { image: EDITORIAL.cupom, title: "10% na primeira compra", text: "Cupom liberado assim que você se cadastra." },
  { image: EDITORIAL.frete, title: "Frete grátis acima de R$ 299", text: "Para todo o Brasil, em qualquer pedido." },
];

export function Membership() {
  return (
    <section id="membros" aria-labelledby="membros-title" className="mx-auto mt-24 max-w-screen-2xl scroll-mt-20 px-4 md:px-12">
      <h2 id="membros-title" className="text-2xl font-medium">
        Vantagens de membro
      </h2>
      <ul className="mt-6 grid gap-3 md:grid-cols-3">
        {PERKS.map((perk, i) => (
          <li key={perk.title}>
            <Reveal delay={i * 0.08} className="relative">
              <Photo image={perk.image} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/5]" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-8 pt-32 text-white">
                <p className="text-2xl font-medium">{perk.title}</p>
                <p className="mt-1">{perk.text}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal className="mt-12 grid gap-8 rounded-3xl bg-surface p-8 md:grid-cols-2 md:items-center md:p-12">
        <div>
          <p className="display text-5xl sm:text-6xl">Seja membro Dream</p>
          <p className="mt-4 max-w-md text-muted">
            Cadastro grátis. Você recebe o cupom de 10% na hora e fica sabendo dos próximos drops antes de todo mundo.
          </p>
        </div>
        <JoinForm />
      </Reveal>
    </section>
  );
}
