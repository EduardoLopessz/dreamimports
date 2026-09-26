"use client";

import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { XIcon } from "@/components/icons";
import { Photo } from "@/components/photo";
import { useTRPC } from "@/lib/trpc";

/** Aviso discreto de compra recente, a cada 25 segundos, com opção de dispensar. */
export function SocialProof() {
  const [seed, setSeed] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const trpc = useTRPC();
  const { data } = useQuery({ ...trpc.recentPurchase.queryOptions({ seed: seed ?? 0 }), enabled: seed !== null });

  useEffect(() => {
    if (dismissed) return;
    let n = 0;
    let hide: ReturnType<typeof setTimeout> | undefined;
    const show = () => {
      n += 1;
      setSeed(n * 3 + new Date().getMinutes());
      setVisible(true);
      hide = setTimeout(() => setVisible(false), 6000);
    };
    const first = setTimeout(show, 8000);
    const loop = setInterval(show, 25000);
    return () => {
      clearTimeout(first);
      clearTimeout(hide);
      clearInterval(loop);
    };
  }, [dismissed]);

  return (
    <AnimatePresence>
      {visible && data && !dismissed && (
        <m.div
          role="status"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          className="fixed bottom-4 left-4 z-30 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl bg-white p-3 pr-2 shadow-[0_8px_32px_rgba(17,17,17,0.14)]"
        >
          <Photo image={data.product.image} sizes="48px" className="size-12 shrink-0 rounded-lg" />
          <Link href={`/produto/${data.product.slug}`} className="text-sm">
            <span className="font-medium">{data.buyer}</span> comprou {data.product.name}
            <span className="block text-xs text-muted">há {data.minutesAgo} minutos</span>
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="grid size-8 shrink-0 place-items-center rounded-full hover:bg-surface"
            aria-label="Não mostrar mais"
          >
            <XIcon size={16} />
          </button>
        </m.div>
      )}
    </AnimatePresence>
  );
}
