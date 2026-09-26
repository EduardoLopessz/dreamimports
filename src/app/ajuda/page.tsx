import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ajuda",
  description: "Prazos de entrega, trocas, formas de pagamento, guia de tamanhos e contato da Dream Store.",
};

const SECTIONS = [
  {
    id: "pedido",
    q: "Como rastreio meu pedido?",
    a: "Assim que o pedido sai do nosso centro de distribuição, enviamos o código de rastreio por email e WhatsApp. Você também acompanha tudo na área Meus pedidos.",
  },
  {
    id: "entrega",
    q: "Qual é o prazo de entrega?",
    a: "Capitais do Sul e Sudeste recebem entre 2 e 4 dias úteis. Demais regiões, entre 4 e 8 dias úteis. O frete é grátis para compras acima de R$ 299.",
  },
  {
    id: "trocas",
    q: "Como funciona a troca?",
    a: "A primeira troca é grátis em até 30 dias após o recebimento. A peça precisa estar sem uso e com etiqueta. Você solicita pelo site e posta em qualquer agência dos Correios.",
  },
  {
    id: "pagamento",
    q: "Quais são as formas de pagamento?",
    a: "Pix com 5% de desconto e aprovação na hora, cartão de crédito em até 10x sem juros (Visa, Mastercard, Elo e American Express) e boleto.",
  },
  {
    id: "tamanhos",
    q: "Como escolho meu tamanho?",
    a: "Nossas peças oversized vestem mais largas de propósito. Se você prefere um caimento ajustado, escolha um tamanho abaixo. Medidas do tórax: P 100 cm, M 106 cm, G 112 cm, GG 118 cm, XG 124 cm.",
  },
  {
    id: "sobre",
    q: "O que é a Dream Store?",
    a: "Uma marca de streetwear brasileira que lança drops semanais de moletons, camisetas, calças e jaquetas em tiragem limitada.",
  },
  {
    id: "contato",
    q: "Como falo com a Dream?",
    a: "Pelo email contato@dreamstore.com.br ou pelo WhatsApp, de segunda a sábado, das 9h às 20h.",
  },
  {
    id: "privacidade",
    q: "Política de privacidade",
    a: "Usamos seus dados apenas para processar pedidos e, se você autorizar, enviar novidades. Você pode pedir a exclusão dos seus dados a qualquer momento, conforme a LGPD.",
  },
  {
    id: "termos",
    q: "Termos de uso",
    a: "Preços e estoque podem mudar sem aviso. Cupons não são cumulativos, salvo quando indicado. Esta é uma versão de demonstração da loja.",
  },
];

export default function HelpPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SECTIONS.slice(0, 7).map((s) => ({
      "@type": "Question",
      name: s.q,
      acceptedAnswer: { "@type": "Answer", text: s.a },
    })),
  };
  return (
    <div className="mx-auto max-w-3xl px-4 pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="display text-6xl">Ajuda</h1>
      <p className="mt-4 text-muted">Respostas rápidas sobre pedidos, entrega, trocas e pagamento.</p>
      <div className="mt-10 divide-y divide-line border-y border-line">
        {SECTIONS.map((s) => (
          <details key={s.id} id={s.id} className="group scroll-mt-24 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-medium">
              {s.q}
              <span aria-hidden className="text-2xl transition-transform duration-300 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-muted">{s.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
