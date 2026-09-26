"use client";

import { useSyncExternalStore } from "react";

/** Fim do drop: próximo domingo às 23h59 (horário de Brasília). */
function nextDropEnd(now: Date) {
  const brt = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
  const offset = now.getTime() - brt.getTime();
  const end = new Date(brt);
  end.setDate(brt.getDate() + ((7 - brt.getDay()) % 7));
  end.setHours(23, 59, 59, 0);
  return end.getTime() + offset;
}

function parts(ms: number) {
  const s = Math.max(Math.floor(ms / 1000), 0);
  return [
    { value: Math.floor(s / 86400), label: "dias" },
    { value: Math.floor((s % 86400) / 3600), label: "horas" },
    { value: Math.floor((s % 3600) / 60), label: "min" },
    { value: s % 60, label: "seg" },
  ];
}

/**
 * Relógio compartilhado: um único intervalo para todas as contagens da página,
 * que para quando a aba fica em segundo plano e quando nenhuma contagem está montada.
 */
const clock = (() => {
  const listeners = new Set<() => void>();
  let now = 0;
  let id: ReturnType<typeof setInterval> | undefined;
  const tick = () => {
    now = Math.floor(Date.now() / 1000) * 1000;
    listeners.forEach((l) => l());
  };
  const start = () => {
    if (id !== undefined || document.hidden) return;
    tick();
    id = setInterval(tick, 1000);
  };
  const stop = () => {
    clearInterval(id);
    id = undefined;
  };
  const onVisibility = () => (document.hidden ? stop() : start());
  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (listeners.size === 1) {
        document.addEventListener("visibilitychange", onVisibility);
        start();
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          stop();
          document.removeEventListener("visibilitychange", onVisibility);
        }
      };
    },
    get: () => now,
  };
})();

export function Countdown({ tone = "light" }: { tone?: "light" | "dark" }) {
  // No servidor (e antes de hidratar) mostra "--"; depois, o relógio compartilhado.
  const now = useSyncExternalStore(clock.subscribe, clock.get, () => 0);
  const items = now === 0 ? null : parts(nextDropEnd(new Date(now)) - now);
  return (
    <div role="timer" aria-label="Tempo restante do drop" className="flex items-center gap-2">
      {(items ?? parts(0)).map((p) => (
        <div
          key={p.label}
          className={
            tone === "dark"
              ? "w-16 rounded-xl bg-black/35 py-2 text-center text-white"
              : "w-16 rounded-xl bg-surface py-2 text-center"
          }
        >
          <span className="block text-2xl font-medium tabular-nums">
            {items ? String(p.value).padStart(2, "0") : "--"}
          </span>
          <span className={tone === "dark" ? "text-xs text-white/80" : "text-xs text-muted"}>{p.label}</span>
        </div>
      ))}
    </div>
  );
}
