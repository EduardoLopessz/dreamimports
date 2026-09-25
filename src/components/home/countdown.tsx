"use client";

import { useEffect, useState } from "react";

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

export function Countdown() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const end = nextDropEnd(new Date());
    const tick = () => setRemaining(end - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const items = remaining === null ? null : parts(remaining);
  return (
    <div role="timer" aria-label="Tempo restante do drop" className="flex items-center justify-center gap-2">
      {(items ?? parts(0)).map((p) => (
        <div key={p.label} className="w-16 rounded-xl bg-surface py-2 text-center">
          <span className="block text-2xl font-medium tabular-nums">
            {items ? String(p.value).padStart(2, "0") : "--"}
          </span>
          <span className="text-xs text-muted">{p.label}</span>
        </div>
      ))}
    </div>
  );
}
