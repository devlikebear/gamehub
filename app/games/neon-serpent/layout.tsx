import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gamehub-arcade.pages.dev';

export const metadata: Metadata = {
  title: 'Neon Serpent - GameHub Arcade',
  description: '절차적으로 변화하는 네온 필드를 누비며 성장하세요. 클래식 뱀 게임의 네온 아케이드 리메이크',
  openGraph: {
    title: 'Neon Serpent - GameHub Arcade',
    description: '절차적으로 변화하는 네온 필드를 누비며 성장하세요',
    url: `${baseUrl}/games/neon-serpent`,
    siteName: 'GameHub Arcade',
    images: [
      {
        url: `${baseUrl}/icon.svg`,
        width: 512,
        height: 512,
        alt: 'Neon Serpent - 네온 아케이드 뱀 게임',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Neon Serpent - GameHub Arcade',
    description: '절차적으로 변화하는 네온 필드를 누비며 성장하세요',
    images: [`${baseUrl}/icon.svg`],
  },
};

export default function NeonSerpentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
