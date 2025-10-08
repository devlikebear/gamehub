'use client';

import Link from 'next/link';

const featuredTitles = [
  {
    id: 'stellar-salvo',
    name: 'Stellar Salvo',
    emoji: '🛡️',
    description: '원형 궤도를 따라 VOID WRAITH를 견제하는 네온 디펜스 슈팅',
    href: '/games/stellar-salvo',
    accent: 'border-bright-cyan hover:shadow-neon-cyan text-bright',
  },
  {
    id: 'photon-vanguard',
    name: 'Photon Vanguard',
    emoji: '🌀',
    description: '시간 왜곡과 파동 방어로 포톤 군단을 막아내는 궤도 수비',
    href: '/games/photon-vanguard',
    accent: 'border-bright-yellow hover:shadow-neon-yellow text-bright-yellow',
  },
  {
    id: 'spectral-pursuit',
    name: 'Spectral Pursuit',
    emoji: '🔮',
    description: '위장을 유지하며 라비린스를 벗어나는 네온 스텔스 추격전',
    href: '/games/spectral-pursuit',
    accent: 'border-bright-pink hover:shadow-neon-pink text-bright-pink',
  },
  {
    id: 'cascade-blocks',
    name: 'Cascade Blocks',
    emoji: '🔷',
    description: '컬러 공명을 이어가는 네온 퍼즐',
    href: '/games/cascade-blocks',
    accent: 'border-bright-purple hover:shadow-neon-purple text-bright',
  },
];

const bulletFeatures = [
  { label: '100% Original IP', desc: '저작권 걱정 없는 네온 아케이드 세계관' },
  { label: 'Playable Now', desc: '브라우저에서 즉시 시작 · 설치 불필요' },
  { label: 'Canvas Engine', desc: 'HTML5 캔버스로 구현한 60FPS 게임 루프' },
];

export default function Home() {
  return (
    <main className="min-h-screen relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-cyan-950 opacity-70" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28 space-y-16">
        {/* Hero */}
        <section className="text-center md:text-left flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="flex-1 space-y-5">
            <h1 className="pixel-text text-5xl md:text-6xl lg:text-7xl text-bright neon-text">GAMEHUB</h1>
            <p className="pixel-text text-sm md:text-base text-bright-pink tracking-[0.3em] uppercase">
              Neon Arcade Universe
            </p>
            <p className="text-bright text-lg md:text-xl leading-relaxed max-w-2xl">
              고전 아케이드 오락실의 스페이스 슈터 감성을 오리지널 메커닉으로 재해석했습니다. 새롭게 공개된{' '}
              <span className="text-bright-cyan font-semibold">Stellar Salvo</span>를 포함해 모든 타이틀이 정식 플레이 가능!
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
              <Link
                href="/games"
                className="px-6 py-2 border-2 border-bright-cyan text-bright pixel-text text-xs rounded-lg hover:bg-bright-cyan hover:text-black transition-all duration-300 shadow-neon-cyan hover:shadow-none"
              >
                Enter the Arcade
              </Link>
              <Link
                href="https://github.com/devlikebear/gamehub"
                className="px-6 py-2 border border-bright text-bright pixel-text text-xs rounded-lg hover:bg-bright/10 transition-all duration-300"
              >
                View on GitHub
              </Link>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              {bulletFeatures.map((feature) => (
                <li
                  key={feature.label}
                  className="p-4 bg-black/40 border border-bright/40 rounded-lg text-left space-y-1"
                >
                  <p className="pixel-text text-xs text-bright">{feature.label}</p>
                  <p className="text-bright text-xs">{feature.desc}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full">
            <div className="relative w-full aspect-square md:aspect-video border-2 border-bright-cyan rounded-2xl shadow-neon-cyan bg-black/50 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,#00f0ff55,transparent_45%)]" />
              <div className="relative text-center space-y-4 px-6">
                <p className="pixel-text text-sm text-bright-cyan uppercase tracking-wider">New Title</p>
                <h2 className="pixel-text text-3xl md:text-4xl text-bright">Stellar Salvo</h2>
                <p className="text-bright text-sm md:text-base leading-relaxed">
                  VOID WRAITH 웨이브를 플럭스 펄스로 제압하세요. Shift 대시로 궤도를 비우고 코어 에너지를 지켜내는 원형 디펜스 슈터입니다.
                </p>
                <Link
                  href="/games/stellar-salvo"
                  className="inline-block px-5 py-2 border border-bright-cyan text-bright pixel-text text-xs rounded-lg hover:bg-bright-cyan hover:text-black transition-all duration-300 shadow-neon-cyan hover:shadow-none"
                >
                  Play Stellar Salvo
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Games */}
        <section>
          <h3 className="pixel-text text-sm md:text-base text-bright-pink uppercase tracking-wider text-center md:text-left mb-6">
            Featured Titles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTitles.map((title) => (
              <Link
                key={title.id}
                href={title.href}
                className={`p-5 bg-black/40 border-2 rounded-lg transition-shadow duration-300 hover:scale-[1.01] ${title.accent}`}
              >
                <div className="text-4xl mb-3">{title.emoji}</div>
                <p className="pixel-text text-xs text-bright mb-2">{title.name.toUpperCase()}</p>
                <p className="text-bright text-xs">{title.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-black/50 border border-bright-cyan/60 rounded-xl px-6 py-10 shadow-neon-cyan">
          <p className="pixel-text text-sm text-bright-cyan mb-3 uppercase tracking-wide">Ready to Dive In?</p>
          <p className="text-bright text-sm md:text-base max-w-2xl mx-auto mb-6">
            모든 게임은 브라우저에서 즉시 실행되며 저작권 걱정이 없는 오리지널 컨텐츠입니다. 더 많은 네온 아케이드를 만들 수 있도록
            피드백과 아이디어를 보내주세요!
          </p>
          <Link
            href="/games"
            className="inline-block px-6 py-2 border-2 border-bright-cyan text-bright pixel-text text-xs rounded-lg hover:bg-bright-cyan hover:text-black transition-all duration-300 shadow-neon-cyan hover:shadow-none"
          >
            Browse Game List
          </Link>
        </section>
      </div>
    </main>
  );
}
