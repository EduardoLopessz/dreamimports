"use client";

import { useRef, useState } from "react";
import { Photo } from "@/components/photo";
import type { ProductImage } from "@/db/schema";
import { cn } from "@/lib/utils";

/** Foto do produto com zoom que segue o cursor (só com mouse; no toque fica normal). */
export function ZoomPhoto({
  image,
  priority,
  className,
}: {
  image: ProductImage;
  priority?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState<string | null>(null);

  return (
    <div
      ref={ref}
      className={cn("relative cursor-zoom-in overflow-hidden", className)}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
      }}
      onPointerLeave={() => setOrigin(null)}
    >
      <Photo
        image={image}
        priority={priority}
        quality={85}
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="absolute inset-0"
        imgClassName={cn("transition-transform ease-fluid", origin ? "scale-[1.8] duration-200" : "duration-500")}
        imgStyle={origin ? { transformOrigin: origin } : undefined}
      />
    </div>
  );
}
