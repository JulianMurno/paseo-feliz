import type { Metadata } from "next";
import { Nunito, Poppins } from "next/font/google";
import "@/lib/fontawesome";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSessionUser } from "@/lib/auth";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Paseo Feliz 🐾 | Paseadores de perros de confianza",
  description:
    "Conecta con paseadores de perros verificados, cerca de ti. Reservas fáciles, rastreo GPS y reseñas reales. Paseo Feliz.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <html lang="es" className={`${nunito.variable} ${poppins.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Navbar user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
