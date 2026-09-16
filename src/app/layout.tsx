import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "@/styles/tokens.css";
import "./globals.css";
import { Nav } from "@/components/Nav/Nav";
import { Footer } from "@/components/Footer/Footer";
import { I18nProvider } from "@/i18n/I18nProvider";
import { RouteTitle } from "@/components/i18n/RouteTitle";
import { profile } from "@/data/profile";

// Família única do site (identidade noite verde, design 2a): Manrope.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

// Mono apenas para blocos de código da biblioteca.
const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jbmono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} · Portfólio & Biblioteca`,
  description:
    "Portfólio de Gabriel Lauxen, desenvolvedor fullstack — e biblioteca reutilizável de backgrounds parametrizados, componentes e animações.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${jbMono.variable}`}>
      <body>
        <I18nProvider>
          <RouteTitle />
          <Nav />
          <main>{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
