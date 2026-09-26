# Dream Store

Loja de streetwear (moletons, camisetas, calças e jaquetas) com layout inspirado na Nike: fundo branco, fotos grandes e títulos condensados.

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:3000
```

Outros comandos:

```bash
npm run build       # build de produção
npm run lint        # ESLint
npm run typecheck   # checagem de tipos
npm run format      # Prettier (com ordenação de classes do Tailwind)
npm test            # Playwright: fluxos de compra e acessibilidade (axe), em desktop e celular. Rode depois do build.
```

## Publicar na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório `eduardolopessz/dreamimports`.
2. A Vercel detecta o Next.js sozinha. Não precisa de variáveis de ambiente.
3. Cada push gera um link de preview. O branch principal vira o site de produção.

## Stack

| Camada           | Tecnologia                                                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework        | Next.js 16 (App Router, Turbopack), React 19, TypeScript                                                                                          |
| Estilo           | Tailwind CSS v4, `clsx` + `tailwind-merge`, `class-variance-authority` (padrão shadcn/ui)                                                         |
| Componentes      | Radix Dialog (sacola, menu e busca), React Aria Components (cor e tamanho)                                                                        |
| Animação         | Motion (Framer Motion), AutoAnimate na lista da sacola, keyframes CSS na capa                                                                     |
| Estado           | Zustand com persistência (sacola e favoritos)                                                                                                     |
| Dados no cliente | TanStack Query + tRPC v11                                                                                                                         |
| API              | Hono (`/api`) servindo o tRPC em `/api/trpc`                                                                                                      |
| Banco            | Schema Drizzle em `src/db/schema.ts`. Hoje os dados vêm de `src/db/data.ts`; ligar um Postgres (por exemplo Neon) muda só `src/server/catalog.ts` |
| Ícones           | Phosphor Icons e Simple Icons (Pix)                                                                                                               |
| Fontes           | Anton (títulos) e Geist (texto), servidas localmente com `next/font/local`                                                                        |
| Testes           | Playwright + axe-core (acessibilidade WCAG 2.1 AA)                                                                                                |
| Métricas         | Vercel Analytics e Speed Insights                                                                                                                 |

## O que a loja faz

- Home com capa em tela cheia, contagem regressiva do drop, carrossel de mais vendidos, look com 15% de desconto e clube de membros
- Mega menu por gênero (Masculino, Feminino, Unissex), com categorias e destaque
- Listagem com filtros de categoria, tamanho, cor e preço (contagens que respeitam os outros filtros) e ordenação
- Página de produto com zoom na foto, guia de tamanhos, estoque baixo por tamanho, cálculo de entrega por CEP e avaliações
- Sacola com barra de frete grátis, cupom (DREAM10), sugestão de produto e preço no Pix
- Checkout com endereço pelo CEP (ViaCEP), frete econômico ou expresso, Pix com 5% off ou cartão em até 10x, e página de pedido confirmado
- Imagem de compartilhamento (Open Graph), sitemap, robots e dados estruturados de produto e FAQ

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

Todas as fotos são do Pexels (Licença Pexels, uso comercial livre), servidas pelo CDN `images.pexels.com` e otimizadas pelo `next/image`. A lista com os autores fica em `/creditos`. Para trocar uma foto, copie o número do fim da URL da foto no Pexels (por exemplo `pexels.com/photo/nome-da-foto-1816870/`) para o campo `pexelsId` em `src/db/data.ts`.

## O que é demonstração

- Checkout: o fluxo é completo, mas o pedido é simulado e nada é cobrado; o meio de pagamento (Pix e cartão) ainda não foi integrado. Dados de cartão nunca são guardados.
- Cadastro de membro: valida o email e mostra o cupom `DREAM10`, mas ainda não envia para uma ferramenta de email.
- Avaliações, "pessoas vendo agora" e "compra recente" usam dados de exemplo.
