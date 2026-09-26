import { Hono } from "hono";
import { handle } from "hono/vercel";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "@/server/trpc";

const app = new Hono().basePath("/api");

app.get("/health", (c) => c.json({ ok: true }));

// TEMPORÁRIO: descobre a URL de CDN de cada foto do Unsplash. Remover depois.
app.get("/debug/unsplash", async (c) => {
  const ids = (c.req.query("ids") ?? "").split(",").filter(Boolean).slice(0, 30);
  const ua = { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128 Safari/537.36" };
  const out = await Promise.all(
    ids.map(async (id) => {
      const r: Record<string, unknown> = { id };
      try {
        const api = await fetch(`https://unsplash.com/napi/photos/${id}`, { headers: ua });
        r.napiStatus = api.status;
        if (api.ok) {
          const j = (await api.json()) as { urls?: { raw?: string }; premium?: boolean; plus?: boolean; user?: { name?: string } };
          r.raw = j.urls?.raw;
          r.premium = j.premium ?? j.plus;
          r.author = j.user?.name;
        }
      } catch (e) {
        r.napiError = String(e);
      }
      if (!r.raw) {
        try {
          const d = await fetch(`https://unsplash.com/photos/${id}/download`, { headers: ua, redirect: "manual" });
          r.dlStatus = d.status;
          r.location = d.headers.get("location");
        } catch (e) {
          r.dlError = String(e);
        }
      }
      return r;
    }),
  );
  return c.json(out);
});

// TEMPORÁRIO: confere se o CDN do Pexels entrega cada foto. Remover depois.
app.get("/debug/pexels", async (c) => {
  const ids = (c.req.query("ids") ?? "").split(",").filter(Boolean).slice(0, 40);
  const out = await Promise.all(
    ids.map(async (id) => {
      const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=64`;
      try {
        const r = await fetch(url);
        const buf = await r.arrayBuffer();
        return { id, status: r.status, type: r.headers.get("content-type"), bytes: buf.byteLength };
      } catch (e) {
        return { id, error: String(e) };
      }
    }),
  );
  return c.json(out);
});

app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
  }),
);

export const GET = handle(app);
export const POST = handle(app);
