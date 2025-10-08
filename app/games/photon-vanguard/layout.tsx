import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gamehub-arcade.pages.dev';

export const metadata: Metadata = {
  title: 'Photon Vanguard - GameHub Arcade',
  description: '360도 방향에서 밀려오는 적을 막아내세요. 방사형 타워 디펜스 슈팅 게임',
  openGraph: {
    title: 'Photon Vanguard - GameHub Arcade',
    description: '360도 방향에서 밀려오는 적을 막아내세요',
    url: `${baseUrl}/games/photon-vanguard`,
    siteName: 'GameHub Arcade',
    images: [
      {
        url: `${baseUrl}/icon.svg`,
        width: 512,
        height: 512,
        alt: 'Photon Vanguard - 방사형 타워 디펜스 게임',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Photon Vanguard - GameHub Arcade',
    description: '360도 방향에서 밀려오는 적을 막아내세요',
    images: [`${baseUrl}/icon.svg`],
  },
};

export default function PhotonVanguardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
