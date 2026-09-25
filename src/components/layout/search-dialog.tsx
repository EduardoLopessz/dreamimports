"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { MagnifyingGlassIcon, XIcon } from "@/components/icons";
import { Photo } from "@/components/photo";
import { useTRPC } from "@/lib/trpc";
import { formatPrice } from "@/lib/utils";

const POPULAR = ["Moletom", "Calça cargo", "Camiseta", "Jaqueta"];

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const deferred = useDeferredValue(q.trim());
  const trpc = useTRPC();
  const { data, isFetching } = useQuery({
    ...trpc.search.queryOptions({ q: deferred }),
    enabled: open && deferred.length > 1,
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger aria-label="Buscar produtos" className="flex h-10 items-center gap-2 rounded-full px-2 hover:bg-surface md:bg-surface md:px-3 md:pr-12">
        <MagnifyingGlassIcon size={24} />
        <span className="hidden text-base text-muted md:inline">Buscar</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="fixed inset-x-0 top-0 z-50 max-h-[85vh] overflow-y-auto bg-white px-4 pt-6 pb-10 md:px-12">
          <Dialog.Title className="sr-only">Buscar produtos</Dialog.Title>
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <label className="flex h-12 flex-1 items-center gap-3 rounded-full bg-surface px-4">
              <MagnifyingGlassIcon size={24} aria-hidden />
              <span className="sr-only">Buscar</span>
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar moletom, camiseta, calça..."
                className="h-full flex-1 bg-transparent text-base outline-none"
              />
            </label>
            <Dialog.Close className="grid size-10 place-items-center rounded-full hover:bg-surface" aria-label="Fechar busca">
              <XIcon size={24} />
            </Dialog.Close>
          </div>

          <div className="mx-auto mt-8 max-w-3xl">
            {deferred.length < 2 ? (
              <div>
                <p className="text-sm text-muted">Termos mais buscados</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {POPULAR.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQ(term)}
                      className="rounded-full bg-surface px-4 py-2 text-base font-medium hover:bg-line"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : data && data.length > 0 ? (
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {data.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/produto/${p.slug}`} onClick={() => setOpen(false)} className="group block">
                      <Photo image={p.image} sizes="(min-width: 768px) 250px, 45vw" className="aspect-square" imgClassName="transition-transform duration-700 ease-fluid group-hover:scale-105" />
                      <p className="mt-2 font-medium">{p.name}</p>
                      <p className="text-muted">{p.subtitle}</p>
                      <p className="font-medium">{formatPrice(p.priceCents)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : isFetching ? (
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-3" aria-label="Carregando resultados">
                {Array.from({ length: 3 }, (_, i) => (
                  <li key={i} className="space-y-2">
                    <div className="aspect-square animate-pulse bg-surface" />
                    <div className="h-4 w-2/3 animate-pulse bg-surface" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">
                Nenhum produto encontrado para “{deferred}”. Tente buscar por moletom, camiseta, calça ou jaqueta.
              </p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
