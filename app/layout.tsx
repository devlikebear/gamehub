import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import localFont from "next/font/local";
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

const galmuri = localFont({
  src: "./fonts/Galmuri11.woff2",
  display: "swap",
  variable: "--font-galmuri",
});

export const metadata: Metadata = {
  title: {
    default: "GameHub - Retro Arcade Games",
    template: "%s | GameHub",
  },
  description: "Play original neon arcade reinterpretations of maze runners, paddle duels, color matching puzzles and more.",
  keywords: ["arcade", "retro-inspired", "original games", "browser arcade", "neon games"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${pressStart2P.variable} ${galmuri.variable}`}>
      <body className={`${inter.className} antialiased flex flex-col min-h-screen`}>
        <Navbar />
        <div className="flex-1 pt-16">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
