import { Cinzel, Manrope } from "next/font/google";
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
    <html lang="pt-BR" className={`${cinzel.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
