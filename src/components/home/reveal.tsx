"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

/** Entrada suave ao aparecer na tela (IntersectionObserver via whileInView, uma vez só). */
export function Reveal({
  children,
  delay = 0,
  as = "div",
  variant = "text",
  className,
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "section";
  variant?: "text" | "image";
  className?: string;
}) {
  const Comp = as === "section" ? m.section : m.div;
  // Só transform e opacity: rodam na GPU sem repintar. Nada de filter: blur em blocos grandes,
  // que é caro de desenhar a cada quadro, principalmente no celular.
  const initial = variant === "image" ? { opacity: 0, scale: 1.02 } : { opacity: 0, y: 20 };
  const animate = variant === "image" ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0 };
  return (
    <Comp
      className={className}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "0px 0px 10% 0px" }}
      transition={{ duration: variant === "image" ? 0.7 : 0.55, delay, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </Comp>
  );
}
