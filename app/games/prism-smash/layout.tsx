import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gamehub-arcade.pages.dev';

export const metadata: Metadata = {
  title: 'Prism Smash - GameHub Arcade',
  description: '패들로 프리즘 볼을 반사시켜 벽돌을 파괴하세요. 레트로 브레이크아웃 게임',
  openGraph: {
    title: 'Prism Smash - GameHub Arcade',
    description: '패들로 프리즘 볼을 반사시켜 벽돌을 파괴하세요',
    url: `${baseUrl}/games/prism-smash`,
    siteName: 'GameHub Arcade',
    images: [
      {
        url: `${baseUrl}/icon.svg`,
        width: 512,
        height: 512,
        alt: 'Prism Smash - 브레이크아웃 게임',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Prism Smash - GameHub Arcade',
    description: '패들로 프리즘 볼을 반사시켜 벽돌을 파괴하세요',
    images: [`${baseUrl}/icon.svg`],
  },
};

export default function PrismSmashLayout({ children }: { children: React.ReactNode }) {
  return children;
}
