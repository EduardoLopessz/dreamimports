import Link from "next/link";
import {
  ArrowsLeftRightIcon,
  CreditCardIcon,
  GlobeSimpleIcon,
  InstagramLogoIcon,
  TiktokLogoIcon,
  TruckIcon,
  XLogoIcon,
  YoutubeLogoIcon,
} from "@/components/icons";
import { PixIcon } from "@/components/payment-icons";

const COLUMNS = [
  {
    title: "Recursos",
    links: [
      { href: "/c/lancamentos", label: "Lançamentos" },
      { href: "/ajuda#tamanhos", label: "Guia de tamanhos" },
      { href: "/#membros", label: "Clube Dream" },
      { href: "/c/outlet", label: "Outlet" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { href: "/ajuda#pedido", label: "Rastrear pedido" },
      { href: "/ajuda#trocas", label: "Trocas e devoluções" },
      { href: "/ajuda#entrega", label: "Prazos de entrega" },
      { href: "/ajuda#pagamento", label: "Formas de pagamento" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/ajuda#sobre", label: "Sobre a Dream" },
      { href: "/ajuda#contato", label: "Fale com a gente" },
    ],
  },
];

const GUARANTEES = [
  { icon: TruckIcon, title: "Frete grátis", text: "Acima de R$ 299" },
  { icon: CreditCardIcon, title: "10x sem juros", text: "Em todos os cartões" },
  { icon: PixIcon, title: "5% off no Pix", text: "Aprovação na hora" },
  { icon: ArrowsLeftRightIcon, title: "Troca grátis", text: "Em até 30 dias" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-12">
        <ul className="grid grid-cols-2 gap-6 border-y border-line py-8 md:grid-cols-4">
          {GUARANTEES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3">
              <Icon size={28} aria-hidden />
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="grid gap-10 py-12 md:grid-cols-[repeat(3,minmax(0,1fr))_auto]">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="font-medium">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm font-medium text-muted hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <p className="font-medium">Siga a Dream</p>
            <ul className="mt-4 flex gap-3">
              {[
                { icon: InstagramLogoIcon, label: "Instagram", href: "https://instagram.com" },
                { icon: TiktokLogoIcon, label: "TikTok", href: "https://tiktok.com" },
                { icon: YoutubeLogoIcon, label: "YouTube", href: "https://youtube.com" },
                { icon: XLogoIcon, label: "X", href: "https://x.com" },
              ].map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="text-muted hover:text-ink"
                  >
                    <Icon size={24} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-2">
            <GlobeSimpleIcon size={16} aria-hidden /> Brasil
            <span className="ml-4">© 2026 Dream Store. Todos os direitos reservados.</span>
          </p>
          <ul className="flex flex-wrap gap-6">
            <li>
              <Link href="/ajuda#privacidade" className="hover:text-ink">
                Política de privacidade
              </Link>
            </li>
            <li>
              <Link href="/ajuda#termos" className="hover:text-ink">
                Termos de uso
              </Link>
            </li>
            <li>
              <Link href="/creditos" className="hover:text-ink">
                Créditos das fotos
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
