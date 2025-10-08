import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gamehub-arcade.pages.dev';

export const metadata: Metadata = {
  title: 'Pulse Paddles - GameHub Arcade',
  description: '네온 펄스 공을 주고받으며 대결하세요. 클래식 퐁 게임의 네온 리메이크',
  openGraph: {
    title: 'Pulse Paddles - GameHub Arcade',
    description: '네온 펄스 공을 주고받으며 대결하세요',
    url: `${baseUrl}/games/pulse-paddles`,
    siteName: 'GameHub Arcade',
    images: [
      {
        url: `${baseUrl}/icon.svg`,
        width: 512,
        height: 512,
        alt: 'Pulse Paddles - 네온 퐁 게임',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Pulse Paddles - GameHub Arcade',
    description: '네온 펄스 공을 주고받으며 대결하세요',
    images: [`${baseUrl}/icon.svg`],
  },
};

export default function PulsePaddlesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
