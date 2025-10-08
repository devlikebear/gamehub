import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gamehub-arcade.pages.dev';

export const metadata: Metadata = {
  title: 'Stellar Salvo - GameHub Arcade',
  description: '절차적으로 진화하는 VOID WRAITH 편대와 맞서 살아남으세요. 레트로 아케이드 슈팅 게임',
  openGraph: {
    title: 'Stellar Salvo - GameHub Arcade',
    description: '절차적으로 진화하는 VOID WRAITH 편대와 맞서 살아남으세요',
    url: `${baseUrl}/games/stellar-salvo`,
    siteName: 'GameHub Arcade',
    images: [
      {
        url: `${baseUrl}/icon.svg`,
        width: 512,
        height: 512,
        alt: 'Stellar Salvo - 레트로 아케이드 슈팅 게임',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Stellar Salvo - GameHub Arcade',
    description: '절차적으로 진화하는 VOID WRAITH 편대와 맞서 살아남으세요',
    images: [`${baseUrl}/icon.svg`],
  },
};

export default function StellarSalvoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
