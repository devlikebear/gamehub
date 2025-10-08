import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { I18nProvider } from "@/lib/i18n/provider";
import { StructuredData } from "./structured-data";
import ServiceWorkerRegistration from "@/components/pwa/ServiceWorkerRegistration";
import { ShortcutsProvider } from "@/components/shortcuts/ShortcutsProvider";

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

const dunggeunmo = localFont({
  src: "../public/fonts/DungGeunMo.woff",
  display: "swap",
  variable: "--font-dunggeunmo",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gamehub.example.com'), // TODO: 실제 도메인으로 변경
  title: {
    default: "GameHub - Retro Arcade Games",
    template: "%s | GameHub",
  },
  description: "Play original neon arcade reinterpretations of maze runners, paddle duels, color matching puzzles and more. Free browser-based retro games with 100% original IP.",
  keywords: [
    "arcade games",
    "retro games",
    "browser games",
    "neon arcade",
    "online arcade",
    "free games",
    "HTML5 games",
    "pixel art games",
    "classic arcade",
    "space shooter",
  ],
  authors: [{ name: "GameHub Team" }],
  creator: "GameHub",
  publisher: "GameHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: ["en_US"],
    url: "/",
    siteName: "GameHub",
    title: "GameHub - Retro Arcade Games",
    description: "Play original neon arcade reinterpretations of maze runners, paddle duels, color matching puzzles and more.",
    images: [
      {
        url: "/og-image.png", // TODO: 실제 OG 이미지 생성 필요
        width: 1200,
        height: 630,
        alt: "GameHub - Retro Arcade Games",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GameHub - Retro Arcade Games",
    description: "Play original neon arcade games in your browser. 100% free, 100% original IP.",
    images: ["/og-image.png"],
    creator: "@gamehub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${pressStart2P.variable} ${dunggeunmo.variable}`}>
      <head>
        <StructuredData />
      </head>
      <body className={`${inter.className} antialiased flex flex-col min-h-screen`}>
        <I18nProvider>
          <ShortcutsProvider>
            <Navbar />
            <div className="flex-1 pt-16">
              {children}
            </div>
            <Footer />
            <ServiceWorkerRegistration />
          </ShortcutsProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
