"use client";

import Link from "next/link";
import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/** Carrossel horizontal com scroll-snap nativo e setas, como o "Os mais vendidos" da Nike. */
export function Carousel({
  title,
  id,
  link,
  children,
  itemClassName = "w-[75vw] sm:w-[45vw] lg:w-[calc((100%-2*12px)/3)]",
}: {
  title: string;
  id: string;
  link?: { href: string; label: string };
  children: ReactNode;
  itemClassName?: string;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const frame = useRef(0);
  const update = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = track.current;
      if (!el) return;
      const start = el.scrollLeft < 8;
      const end = el.scrollLeft + el.clientWidth > el.scrollWidth - 8;
      // mesmo valor = mesmo objeto: o React não renderiza de novo durante o scroll
      setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
    });
  }, []);

  useEffect(() => {
    update();
    const el = track.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame.current);
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section aria-labelledby={id} className="mx-auto mt-24 max-w-screen-2xl">
      <div className="flex items-center justify-between px-4 md:px-12">
        <h2 id={id} className="text-2xl font-medium">
          {title}
        </h2>
        <div className="flex items-center gap-3">
          {link && (
            <Link href={link.href} className="mr-2 font-medium underline underline-offset-4">
              {link.label}
            </Link>
          )}
          {(["prev", "next"] as const).map((dir) => {
            const disabled = dir === "prev" ? edges.start : edges.end;
            return (
              <button
                key={dir}
                onClick={() => scrollBy(dir === "prev" ? -1 : 1)}
                disabled={disabled}
                aria-controls={`${id}-track`}
                aria-label={dir === "prev" ? "Anterior" : "Próximo"}
                className="hidden size-12 place-items-center rounded-full bg-surface transition-colors hover:bg-line disabled:text-line disabled:hover:bg-surface md:grid"
              >
                {dir === "prev" ? <CaretLeftIcon size={22} /> : <CaretRightIcon size={22} />}
              </button>
            );
          })}
        </div>
      </div>
      <ul
        ref={track}
        id={`${id}-track`}
        className="mt-6 scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 md:scroll-px-12 md:px-12"
      >
        {Children.map(children, (child) => (
          <li className={cn("shrink-0 snap-start", itemClassName)}>{child}</li>
        ))}
      </ul>
    </section>
  );
}
