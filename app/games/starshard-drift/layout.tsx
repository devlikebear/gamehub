import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gamehub-arcade.pages.dev';

export const metadata: Metadata = {
  title: 'Starshard Drift - GameHub Arcade',
  description: '중력장을 헤치고 스타샤드를 수집하세요. 물리 기반 중력 미션 게임',
  openGraph: {
    title: 'Starshard Drift - GameHub Arcade',
    description: '중력장을 헤치고 스타샤드를 수집하세요',
    url: `${baseUrl}/games/starshard-drift`,
    siteName: 'GameHub Arcade',
    images: [
      {
        url: `${baseUrl}/icon.svg`,
        width: 512,
        height: 512,
        alt: 'Starshard Drift - 중력 미션 게임',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Starshard Drift - GameHub Arcade',
    description: '중력장을 헤치고 스타샤드를 수집하세요',
    images: [`${baseUrl}/icon.svg`],
  },
};

export default function StarshardDriftLayout({ children }: { children: React.ReactNode }) {
  return children;
}
