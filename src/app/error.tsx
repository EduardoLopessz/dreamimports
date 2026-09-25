"use client";

import { Button, ButtonLink } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-32 text-center">
      <h1 className="text-2xl font-medium">Não conseguimos carregar esta página</h1>
      <p className="mt-2 text-muted">Pode ser uma instabilidade rápida. Tente de novo em alguns segundos.</p>
      <div className="mt-8 flex gap-2">
        <Button onClick={reset}>Tentar de novo</Button>
        <ButtonLink href="/" variant="secondary">
          Ir para o início
        </ButtonLink>
      </div>
    </div>
  );
}
