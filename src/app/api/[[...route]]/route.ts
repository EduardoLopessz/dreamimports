import { Hono } from "hono";
import { handle } from "hono/vercel";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "@/server/trpc";

const app = new Hono().basePath("/api");

app.get("/health", (c) => c.json({ ok: true }));

// TEMPORÁRIO: fotos em base64 para a revisão visual local. Remover depois.
app.get("/debug/photos", async (c) => {
  const ids = (c.req.query("ids") ?? "").split(",").filter((id) => /^\d+$/.test(id)).slice(0, 8);
  const w = Math.min(Number(c.req.query("w") ?? 1200), 1600);
  const out: Record<string, string> = {};
  await Promise.all(
    ids.map(async (id) => {
      const r = await fetch(`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`);
      out[id] = Buffer.from(await r.arrayBuffer()).toString("base64");
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
