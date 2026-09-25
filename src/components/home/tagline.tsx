"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

const LINES = ["Feito para a rua.", "Pensado para durar."];

/** Frase de marca: cada palavra acende conforme a página rola. */
export function Tagline() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = LINES.flatMap((line, li) => line.split(" ").map((w, wi) => ({ w, br: li > 0 && wi === 0 })));

  return (
    <section aria-label="Nossa proposta" className="mx-auto mt-32 max-w-screen-2xl px-4 md:px-12">
      <p ref={ref} className="display mx-auto max-w-4xl text-center text-6xl sm:text-8xl">
        {words.map(({ w, br }, i) => (
          <span key={i}>
            {br && <br />}
            <Word progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {w}
            </Word>{" "}
          </span>
        ))}
      </p>
    </section>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}
