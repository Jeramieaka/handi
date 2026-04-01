import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import EntranceScreen from "@/components/EntranceScreen";
import { CartProvider } from "@/components/CartContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "handi — Carry the world for someone.",
  description:
    "Connect with travelers heading your way. Get exclusive, local, or hard-to-find items from any city in the world.",
  openGraph: {
    title: "handi",
    description: "The peer-to-peer cross-city carry platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable}`}>
      <body className="antialiased">
        <CartProvider>
          <EntranceScreen />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
