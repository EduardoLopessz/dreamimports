import { Hono } from "hono";
import { handle } from "hono/vercel";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "@/server/trpc";

const app = new Hono().basePath("/api");

app.get("/health", (c) => c.json({ ok: true }));

// TEMPORÁRIO: mede o tempo das fotos e gera as miniaturas desfocadas. Sai no próximo commit.
app.get("/probe-photos", async (c) => {
  const { PRODUCTS, EDITORIAL, CATEGORY_COVERS } = await import("@/db/data");
  const ids = [
    ...new Set([
      ...PRODUCTS.flatMap((p) => p.images.map((i) => i.pexelsId)),
      ...Object.values(EDITORIAL).map((i) => i.pexelsId),
      ...Object.values(CATEGORY_COVERS).map((i) => i.pexelsId),
    ]),
  ];
  const px = (id: string, q: string) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?${q}`;
  const timed = async (url: string, accept = "image/avif,image/webp,*/*") => {
    const t = performance.now();
    const r = await fetch(url, { headers: { accept }, cache: "no-store" });
    const buf = await r.arrayBuffer();
    return {
      ms: Math.round(performance.now() - t),
      status: r.status,
      kb: Math.round(buf.byteLength / 1024),
      type: r.headers.get("content-type"),
      cache: r.headers.get("x-vercel-cache") ?? r.headers.get("cf-cache-status"),
    };
  };
  const blur = Object.fromEntries(
    await Promise.all(
      ids.map(async (id) => {
        const r = await fetch(px(id, "auto=compress&cs=tinysrgb&w=12"));
        const b = Buffer.from(await r.arrayBuffer());
        return [id, `data:${r.headers.get("content-type")};base64,${b.toString("base64")}`];
      }),
    ),
  );
  const origin = new URL(c.req.url).origin;
  const sample = ids[3];
  const src = encodeURIComponent(px(sample, "auto=compress&cs=tinysrgb&w=1920"));
  const w = 750; // mesmo tamanho duas vezes: a 1ª mostra o MISS, a 2ª o HIT
  const timing = {
    pexels1920: await timed(px(sample, "auto=compress&cs=tinysrgb&w=1920")),
    pexels1920again: await timed(px(sample, "auto=compress&cs=tinysrgb&w=1920")),
    pexels828: await timed(px(sample, "auto=compress&cs=tinysrgb&w=828")),
    pexels828format: await timed(px(sample, "auto=compress,format&cs=tinysrgb&w=828")),
    pexels828fmwebp: await timed(px(sample, "auto=compress&cs=tinysrgb&w=828&fm=webp")),
    next1: await timed(`${origin}/_next/image?url=${src}&w=${w}&q=75`),
    next2: await timed(`${origin}/_next/image?url=${src}&w=${w}&q=75`),
    nextOther: await timed(`${origin}/_next/image?url=${encodeURIComponent(px(ids[7], "auto=compress&cs=tinysrgb&w=1920"))}&w=1080&q=75`),
  };
  return c.json({ region: process.env.VERCEL_REGION, sample, timing, blur });
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
