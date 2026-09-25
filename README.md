# Dream Store

Loja de streetwear (moletons, camisetas, calças e jaquetas) com layout inspirado na Nike: fundo branco, fotos grandes e títulos condensados.

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:3000
```

Outros comandos:

```bash
npm run build      # build de produção
npm run lint       # ESLint
npx tsc --noEmit   # checagem de tipos
npx playwright test  # testes de ponta a ponta (desktop e celular), depois de `npm run build`
```

## Publicar na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório `eduardolopessz/dreamimports`.
2. A Vercel detecta o Next.js sozinha. Não precisa de variáveis de ambiente.
3. Cada push gera um link de preview. O branch principal vira o site de produção.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Estilo | Tailwind CSS v4, `clsx` + `tailwind-merge`, `class-variance-authority` (padrão shadcn/ui) |
| Componentes | Radix Dialog (sacola, menu e busca), React Aria Components (cor e tamanho) |
| Animação | Motion (Framer Motion), AutoAnimate na lista da sacola, keyframes CSS na capa |
| Estado | Zustand com persistência (sacola e favoritos) |
| Dados no cliente | TanStack Query + tRPC v11 |
| API | Hono (`/api`) servindo o tRPC em `/api/trpc` |
| Banco | Schema Drizzle em `src/db/schema.ts`. Hoje os dados vêm de `src/db/data.ts`; ligar um Postgres (por exemplo Neon) muda só `src/server/catalog.ts` |
| Ícones | Phosphor Icons e Simple Icons (Pix) |
| Fontes | Anton (títulos) e Geist (texto), servidas localmente com `next/font/local` |
| Testes | Playwright |

## Estrutura

```
src/
  app/            rotas: home, /c/[slug], /produto/[slug], /favoritos, /ajuda, /creditos, /api
  components/     layout, home, produto, sacola, ui
  db/             schema Drizzle e dados do catálogo
  server/         catálogo e roteador tRPC
  store/          Zustand (sacola e favoritos)
design/           mockups SVG da fase de aprovação
tests/            testes Playwright
```

## Fotos

Todas as fotos são do Unsplash (Licença Unsplash, uso comercial livre), carregadas pelo `next/image` a partir do link de download de cada foto. A lista com os autores fica em `/creditos`. Para trocar uma foto, altere o `unsplashId` em `src/db/data.ts`.

## O que é demonstração

- Checkout: o botão mostra um aviso, porque o meio de pagamento ainda não foi integrado.
- Cadastro de membro: valida o email e mostra o cupom `DREAM10`, mas ainda não envia para uma ferramenta de email.
- Avaliações, "pessoas vendo agora" e "compra recente" usam dados de exemplo.
