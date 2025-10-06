import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: {
    default: "GameHub - Retro Arcade Games",
    template: "%s | GameHub",
  },
  description: "Play classic arcade games in your browser. Snake, Tetris, Pac-Man and more!",
  keywords: ["arcade games", "retro games", "browser games", "classic games", "online games"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${pressStart2P.variable}`}>
      <body className="antialiased font-sans flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 pt-16">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
