import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
    <html lang="ko" className="font-sans">
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
