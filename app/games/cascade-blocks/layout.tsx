import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gamehub-arcade.pages.dev';

export const metadata: Metadata = {
  title: 'Color Match Cascade - GameHub Arcade',
  description: '같은 색 블록을 매치하고 연쇄 폭발을 터트리세요. 뿌요뿌요 스타일의 퍼즐 게임',
  openGraph: {
    title: 'Color Match Cascade - GameHub Arcade',
    description: '같은 색 블록을 매치하고 연쇄 폭발을 터트리세요',
    url: `${baseUrl}/games/cascade-blocks`,
    siteName: 'GameHub Arcade',
    images: [
      {
        url: `${baseUrl}/icon.svg`,
        width: 512,
        height: 512,
        alt: 'Color Match Cascade - 퍼즐 게임',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Color Match Cascade - GameHub Arcade',
    description: '같은 색 블록을 매치하고 연쇄 폭발을 터트리세요',
    images: [`${baseUrl}/icon.svg`],
  },
};

export default function CascadeBlocksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
