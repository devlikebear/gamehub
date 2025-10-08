'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n/provider';

export default function Home() {
  const { t } = useI18n();

  const featuredTitles = [
    {
      id: 'stellar-salvo',
      name: t.games['stellar-salvo'].name,
      emoji: '🛡️',
      description: t.games['stellar-salvo'].description,
      href: '/games/stellar-salvo',
      accent: 'border-bright-cyan hover:shadow-neon-cyan text-bright',
    },
    {
      id: 'photon-vanguard',
      name: t.games['photon-vanguard'].name,
      emoji: '🌀',
      description: t.games['photon-vanguard'].description,
      href: '/games/photon-vanguard',
      accent: 'border-bright-yellow hover:shadow-neon-yellow text-bright-yellow',
    },
    {
      id: 'spectral-pursuit',
      name: t.games['spectral-pursuit'].name,
      emoji: '🔮',
      description: t.games['spectral-pursuit'].description,
      href: '/games/spectral-pursuit',
      accent: 'border-bright-pink hover:shadow-neon-pink text-bright-pink',
    },
    {
      id: 'cascade-blocks',
      name: t.games['cascade-blocks'].name,
      emoji: '🔷',
      description: t.games['cascade-blocks'].description,
      href: '/games/cascade-blocks',
      accent: 'border-bright-purple hover:shadow-neon-purple text-bright',
    },
  ];

  const bulletFeatures = [
    { label: t.home.features.original.title, desc: t.home.features.original.description },
    { label: t.home.features.playable.title, desc: t.home.features.playable.description },
    { label: t.home.features.canvas.title, desc: t.home.features.canvas.description },
  ];
  return (
    <main className="min-h-screen relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-cyan-950 opacity-70" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28 space-y-16">
        {/* Hero */}
        <section className="text-center md:text-left flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="flex-1 space-y-5">
            <h1 className="pixel-text text-4xl md:text-5xl lg:text-6xl text-bright neon-text animate-neon-pulse">
              {t.home.title}
            </h1>
            <p className="pixel-text text-sm md:text-base text-bright-pink tracking-[0.3em] uppercase">
              {t.home.subtitle}
            </p>
            <p className="pixel-text text-bright text-sm md:text-base leading-relaxed max-w-2xl">
              {t.home.description}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
              <Link
                href="/games"
                className="px-6 py-2 border-2 border-[#00f0ff] pixel-text text-xs rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.5)] hover-glow animate-fade-in"
                style={{ color: '#00f0ff' }}
              >
                {t.common.enterTheArcade}
              </Link>
              <Link
                href="https://github.com/devlikebear/gamehub"
                className="px-6 py-2 border-2 border-[#00f0ff] pixel-text text-xs rounded-lg hover:bg-[#00f0ff]/10 transition-all duration-300 hover-glow animate-fade-in"
                style={{ color: '#00f0ff', animationDelay: '0.1s' }}
              >
                {t.common.viewOnGithub}
              </Link>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              {bulletFeatures.map((feature) => (
                <li
                  key={feature.label}
                  className="p-4 bg-black/40 border border-[#00f0ff]/40 rounded-lg text-left space-y-1"
                >
                  <p className="pixel-text text-xs" style={{ color: '#00f0ff' }}>{feature.label}</p>
                  <p className="pixel-text text-xs" style={{ color: '#00f0ff' }}>{feature.desc}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full">
            <div className="relative w-full aspect-square md:aspect-video border-2 border-[#00f0ff] rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.5)] bg-black/50 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,#00f0ff55,transparent_45%)]" />
              <div className="relative text-center space-y-4 px-6">
                <p className="pixel-text text-sm uppercase tracking-wider" style={{ color: '#00f0ff' }}>{t.games['stellar-salvo'].tagline}</p>
                <h2 className="pixel-text text-3xl md:text-4xl" style={{ color: '#00f0ff' }}>{t.games['stellar-salvo'].name}</h2>
                <p className="pixel-text text-sm md:text-base leading-relaxed" style={{ color: '#00f0ff' }}>
                  {t.games['stellar-salvo'].description}
                </p>
                <Link
                  href="/games/stellar-salvo"
                  className="inline-block px-5 py-2 border-2 border-[#00f0ff] pixel-text text-xs rounded-lg hover:bg-[#00f0ff]/10 transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                  style={{ color: '#00f0ff' }}
                >
                  {t.common.playNow}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Games */}
        <section>
          <h3 className="pixel-text text-sm md:text-base text-bright-pink uppercase tracking-wider text-center md:text-left mb-6">
            {t.home.featuredGames}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTitles.map((title) => (
              <Link
                key={title.id}
                href={title.href}
                className={`p-5 bg-black/40 border-2 rounded-lg transition-shadow duration-300 hover:scale-[1.01] ${title.accent}`}
              >
                <div className="text-4xl mb-3">{title.emoji}</div>
                <p className="pixel-text text-xs mb-2" style={{ color: '#00f0ff' }}>{title.name.toUpperCase()}</p>
                <p className="pixel-text text-xs" style={{ color: '#00f0ff' }}>{title.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-black/50 border border-[#00f0ff]/60 rounded-xl px-6 py-10 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
          <p className="pixel-text text-sm md:text-base max-w-2xl mx-auto mb-6" style={{ color: '#00f0ff' }}>
            {t.home.callToAction}
          </p>
          <Link
            href="/games"
            className="inline-block px-6 py-2 border-2 border-[#00f0ff] pixel-text text-xs rounded-lg hover:bg-[#00f0ff]/10 transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.5)]"
            style={{ color: '#00f0ff' }}
          >
            {t.common.browseGameList}
          </Link>
        </section>
      </div>
    </main>
  );
}
