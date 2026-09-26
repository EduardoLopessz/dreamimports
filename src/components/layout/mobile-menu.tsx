"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { CaretRightIcon, ListIcon, XIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";

export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="grid size-10 place-items-center rounded-full hover:bg-surface lg:hidden"
        aria-label="Abrir menu"
      >
        <ListIcon size={24} />
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <m.div
                className="fixed inset-0 z-50 bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <m.div
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white p-6"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              >
                <div className="flex justify-end">
                  <Dialog.Close
                    className="grid size-10 place-items-center rounded-full hover:bg-surface"
                    aria-label="Fechar menu"
                  >
                    <XIcon size={24} />
                  </Dialog.Close>
                </div>
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <nav aria-label="Menu móvel" className="mt-4">
                  <ul>
                    {links.map((l, i) => (
                      <m.li
                        key={l.href}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 + i * 0.05 }}
                      >
                        <Link
                          href={l.href}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between py-3 text-2xl font-medium"
                        >
                          {l.label}
                          <CaretRightIcon size={20} />
                        </Link>
                      </m.li>
                    ))}
                  </ul>
                </nav>
                <div className="mt-auto space-y-4">
                  <p className="text-muted">
                    Seja membro Dream: acesso antecipado aos drops, 10% na primeira compra e frete grátis acima de R$
                    299.
                  </p>
                  <div className="flex gap-2">
                    <ButtonLink href="/#membros" onClick={() => setOpen(false)}>
                      Seja membro
                    </ButtonLink>
                    <ButtonLink href="/ajuda" variant="secondary" onClick={() => setOpen(false)}>
                      Ajuda
                    </ButtonLink>
                  </div>
                </div>
              </m.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
