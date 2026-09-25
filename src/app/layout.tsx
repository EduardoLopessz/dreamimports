import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { PromoBar } from "@/components/layout/promo-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Providers } from "@/components/providers";
import { SocialProof } from "@/components/social-proof";
import "./globals.css";

const anton = localFont({ src: "./fonts/anton.woff2", variable: "--font-anton", display: "swap" });
const geist = localFont({ src: "./fonts/geist.woff2", variable: "--font-geist", weight: "100 900", display: "swap" });

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Dream Store: streetwear para vestir seu sonho", template: "%s | Dream Store" },
  description:
    "Moletons pesados, camisetas de algodão grosso, calças cargo e jaquetas em drops semanais. 5% off no Pix, 10x sem juros e troca grátis em 30 dias.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Dream Store",
  },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${geist.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <Providers>
          <SiteHeader />
          <PromoBar />
          <main id="conteudo" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <CartDrawer />
          <SocialProof />
        </Providers>
      </body>
    </html>
  );
}
