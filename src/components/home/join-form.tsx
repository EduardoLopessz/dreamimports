"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function JoinForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return setError("Digite seu email.");
    if (!EMAIL.test(email.trim())) return setError("Esse email parece incompleto. Confira e tente de novo.");
    setError(null);
    setStatus("sending");
    // Demonstração: a integração com a ferramenta de email entra na próxima etapa.
    setTimeout(() => {
      setStatus("done");
      toast.success("Cadastro feito. Seu cupom é DREAM10.", {
        description: "Use na sacola para ganhar 10% de desconto.",
      });
    }, 700);
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl bg-white p-6">
        <p className="text-lg font-medium">Bem-vindo ao Clube Dream.</p>
        <p className="mt-1 text-muted">
          Seu cupom de 10%: <strong className="font-medium text-ink">DREAM10</strong>. Ele vale para a primeira compra.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <label htmlFor="join-email" className="font-medium">
        Email
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="join-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@email.com"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "join-error" : "join-hint"}
          className="h-12 flex-1 rounded-full border border-line bg-white px-5 outline-none focus:border-ink aria-invalid:border-sale"
        />
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Cadastrando..." : "Quero meu cupom"}
        </Button>
      </div>
      {error ? (
        <p id="join-error" className="text-sm text-sale">
          {error}
        </p>
      ) : (
        <p id="join-hint" className="text-sm text-muted">
          Sem spam. Você cancela quando quiser.
        </p>
      )}
    </form>
  );
}
