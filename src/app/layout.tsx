import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "@/styles/tokens.css";
import "./globals.css";
import { Nav } from "@/components/Nav/Nav";
import { Footer } from "@/components/Footer/Footer";
import { profile } from "@/data/profile";

// Monospace única do site (identidade neo-brutalist terminal).
const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
    <html lang="pt-BR" className={jbMono.variable}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
