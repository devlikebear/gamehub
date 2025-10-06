import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
    <html lang="ko" className={inter.variable}>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
