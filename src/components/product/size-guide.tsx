"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { RulerIcon, XIcon } from "@/components/icons";

const ROWS = [
  { size: "P", chest: 100, length: 68, height: "1,60 a 1,68 m" },
  { size: "M", chest: 106, length: 70, height: "1,68 a 1,75 m" },
  { size: "G", chest: 112, length: 72, height: "1,75 a 1,82 m" },
  { size: "GG", chest: 118, length: 74, height: "1,82 a 1,88 m" },
  { size: "XG", chest: 124, length: 76, height: "1,88 a 1,95 m" },
];

/** Tabela de medidas em janela, sem sair da página do produto. */
export function SizeGuide() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="flex items-center gap-1 text-sm text-muted underline underline-offset-2 hover:text-ink">
        <RulerIcon size={16} aria-hidden /> Guia de tamanhos
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-2xl font-medium">Guia de tamanhos</Dialog.Title>
              <Dialog.Description className="mt-1 text-muted">
                Medidas da peça em centímetros. Nossa modelagem é oversized: para um caimento ajustado, escolha um
                tamanho abaixo.
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="grid size-10 shrink-0 place-items-center rounded-full hover:bg-surface"
              aria-label="Fechar guia de tamanhos"
            >
              <XIcon size={22} />
            </Dialog.Close>
          </div>
          <table className="mt-6 w-full text-left text-sm">
            <thead className="text-muted">
              <tr className="border-b border-line">
                <th scope="col" className="py-2 font-medium">
                  Tamanho
                </th>
                <th scope="col" className="py-2 font-medium">
                  Tórax
                </th>
                <th scope="col" className="py-2 font-medium">
                  Comprimento
                </th>
                <th scope="col" className="py-2 font-medium">
                  Altura sugerida
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.size} className="border-b border-line last:border-0">
                  <th scope="row" className="py-3 font-medium">
                    {r.size}
                  </th>
                  <td className="py-3 tabular-nums">{r.chest} cm</td>
                  <td className="py-3 tabular-nums">{r.length} cm</td>
                  <td className="py-3">{r.height}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-sm text-muted">Ficou em dúvida? A primeira troca é grátis em até 30 dias.</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
