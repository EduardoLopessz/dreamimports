"use client";

import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const MESSAGES = [
  { text: "Frete grátis para membros Dream em compras acima de R$ 299", cta: "Seja membro", href: "/#membros" },
  { text: "Ganhe 10% na primeira compra com o cupom DREAM10", cta: "Ver lançamentos", href: "/c/lancamentos" },
  { text: "5% off no Pix e 10x sem juros em todo o site", cta: "Comprar agora", href: "/c/masculino" },
];

/** Faixa promocional que alterna as mensagens, como no topo da Nike. */
export function PromoBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const msg = MESSAGES[index];
  return (
    <div className="bg-surface" aria-live="polite">
      <div className="relative mx-auto flex min-h-14 max-w-screen-2xl items-center justify-center overflow-hidden px-4 py-2 text-center">
        <AnimatePresence mode="wait" initial={false}>
          <m.p
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="text-sm leading-tight"
          >
            <span className="font-medium">{msg.text}</span>
            <br />
            <Link href={msg.href} className="text-xs underline underline-offset-2">
              {msg.cta}
            </Link>
          </m.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
