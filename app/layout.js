import { Cinzel, Manrope, Oswald, Anton, Dancing_Script } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

// Fonte condensada para o tema "Visagista" (títulos bold/black, caixa alta).
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

// Fonte pesada/condensada para o tema "Studio Ornellas" e para a logo.
const anton = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-anton",
  display: "swap",
});

// Script para o "Studio" da logo e detalhes elegantes.
const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-script",
  display: "swap",
});

export const metadata = {
  title: "Área de Membros · Ornellas Barbeiro",
  description:
    "Área de membros Ornellas Barbeiro — visagismo, prótese capilar e gestão de barbearia premium, pela metodologia de Gustavo Ornellas.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${cinzel.variable} ${manrope.variable} ${oswald.variable} ${anton.variable} ${dancing.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
