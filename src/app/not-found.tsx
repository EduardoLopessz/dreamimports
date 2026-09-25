import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-32 text-center">
      <p className="display text-9xl">404</p>
      <h1 className="mt-6 text-2xl font-medium">Essa página saiu do drop</h1>
      <p className="mt-2 text-muted">O link pode estar errado ou a peça esgotou. Que tal ver o que chegou esta semana?</p>
      <div className="mt-8 flex gap-2">
        <ButtonLink href="/c/lancamentos">Ver lançamentos</ButtonLink>
        <ButtonLink href="/" variant="secondary">
          Ir para o início
        </ButtonLink>
      </div>
    </div>
  );
}
