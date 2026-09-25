"use client";

import { motion } from "motion/react";
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
  const Comp = as === "section" ? motion.section : motion.div;
  const initial =
    variant === "image" ? { opacity: 0, scale: 1.03 } : { opacity: 0, y: 32, filter: "blur(8px)" };
  const animate = variant === "image" ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" };
  return (
    <Comp
      className={className}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: variant === "image" ? 1.2 : 0.9, delay, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </Comp>
  );
}
