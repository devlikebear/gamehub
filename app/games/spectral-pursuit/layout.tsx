import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gamehub-arcade.pages.dev';

export const metadata: Metadata = {
  title: 'Spectral Pursuit - GameHub Arcade',
  description: '스펙트럴 가디언을 피해 데이터 샤드를 수집하세요. 스텔스 체이스 아케이드 게임',
  openGraph: {
    title: 'Spectral Pursuit - GameHub Arcade',
    description: '스펙트럴 가디언을 피해 데이터 샤드를 수집하세요',
    url: `${baseUrl}/games/spectral-pursuit`,
    siteName: 'GameHub Arcade',
    images: [
      {
        url: `${baseUrl}/icon.svg`,
        width: 512,
        height: 512,
        alt: 'Spectral Pursuit - 스텔스 체이스 게임',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Spectral Pursuit - GameHub Arcade',
    description: '스펙트럴 가디언을 피해 데이터 샤드를 수집하세요',
    images: [`${baseUrl}/icon.svg`],
  },
};

export default function SpectralPursuitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
