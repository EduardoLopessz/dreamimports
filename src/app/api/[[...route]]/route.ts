import { Hono } from "hono";
import { handle } from "hono/vercel";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "@/server/trpc";

const app = new Hono().basePath("/api");

app.get("/health", (c) => c.json({ ok: true }));

// TEMPORÁRIO: miniaturas em base64 para revisão visual das fotos. Remover depois.
app.get("/debug/thumbs", async (c) => {
  const ids = (c.req.query("ids") ?? "").split(",").filter(Boolean).slice(0, 30);
  const out: Record<string, string> = {};
  await Promise.all(
    ids.map(async (id) => {
      const r = await fetch(`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=260`);
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
