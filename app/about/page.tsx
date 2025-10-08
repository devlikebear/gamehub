'use client';

import { useI18n } from '@/lib/i18n/provider';

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="pixel-text text-4xl md:text-5xl lg:text-6xl mb-6 neon-text animate-neon-pulse" style={{ color: '#00f0ff' }}>
            {t.about.title}
          </h1>
          <p className="pixel-text text-base md:text-lg" style={{ color: '#00f0ff' }}>
            {t.about.subtitle}
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-16 p-8 bg-black/50 border-2 border-[#00f0ff] rounded-lg">
          <h2 className="pixel-text text-2xl text-bright-pink mb-6">🎯 {t.about.mission}</h2>
          <p className="pixel-text text-sm leading-relaxed mb-4" style={{ color: '#00f0ff' }}>
            {t.about.missionText1}
          </p>
          <p className="pixel-text text-sm leading-relaxed" style={{ color: '#00f0ff' }}>
            {t.about.missionText2}
          </p>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="pixel-text text-2xl text-bright-yellow mb-8 text-center">
            {t.about.coreValues}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-black/30 border-2 border-bright-green rounded-lg">
              <div className="text-4xl mb-3">🕹️</div>
              <h3 className="pixel-text text-bright-green text-sm mb-3">{t.about.values.retro.title}</h3>
              <p className="pixel-text text-xs" style={{ color: '#00f0ff' }}>
                {t.about.values.retro.description}
              </p>
            </div>

            <div className="p-6 bg-black/30 border-2 border-[#00f0ff] rounded-lg">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="pixel-text text-sm mb-3" style={{ color: '#00f0ff' }}>{t.about.values.instant.title}</h3>
              <p className="pixel-text text-xs" style={{ color: '#00f0ff' }}>
                {t.about.values.instant.description}
              </p>
            </div>

            <div className="p-6 bg-black/30 border-2 border-bright-pink rounded-lg">
              <div className="text-4xl mb-3">🎮</div>
              <h3 className="pixel-text text-bright-pink text-sm mb-3">{t.about.values.easy.title}</h3>
              <p className="pixel-text text-xs" style={{ color: '#00f0ff' }}>
                {t.about.values.easy.description}
              </p>
            </div>

            <div className="p-6 bg-black/30 border-2 border-bright-purple rounded-lg">
              <div className="text-4xl mb-3">🆓</div>
              <h3 className="pixel-text text-bright-purple text-sm mb-3">{t.about.values.free.title}</h3>
              <p className="pixel-text text-xs" style={{ color: '#00f0ff' }}>
                {t.about.values.free.description}
              </p>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-16 p-8 bg-black/50 border-2 border-bright-purple rounded-lg">
          <h2 className="pixel-text text-2xl text-bright-yellow mb-6">⚙️ {t.about.techStack}</h2>

          <div className="space-y-4">
            <div>
              <h3 className="pixel-text text-sm text-bright-pink mb-2">{t.about.frontend}</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-black/50 border border-[#00f0ff] pixel-text text-xs rounded" style={{ color: '#00f0ff' }}>
                  Next.js 15
                </span>
                <span className="px-3 py-1 bg-black/50 border border-[#00f0ff] pixel-text text-xs rounded" style={{ color: '#00f0ff' }}>
                  TypeScript
                </span>
                <span className="px-3 py-1 bg-black/50 border border-[#00f0ff] pixel-text text-xs rounded" style={{ color: '#00f0ff' }}>
                  Tailwind CSS 4
                </span>
                <span className="px-3 py-1 bg-black/50 border border-[#00f0ff] pixel-text text-xs rounded" style={{ color: '#00f0ff' }}>
                  HTML5 Canvas
                </span>
              </div>
            </div>

            <div>
              <h3 className="pixel-text text-sm text-bright-pink mb-2">{t.about.infrastructure}</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-black/50 border border-bright-green pixel-text text-xs rounded text-bright-green">
                  Cloudflare Pages
                </span>
                <span className="px-3 py-1 bg-black/50 border border-bright-green pixel-text text-xs rounded text-bright-green">
                  Edge Network
                </span>
                <span className="px-3 py-1 bg-black/50 border border-bright-green pixel-text text-xs rounded text-bright-green">
                  Auto SSL
                </span>
              </div>
            </div>

            <div>
              <h3 className="pixel-text text-sm text-bright-pink mb-2">{t.about.gameEngine}</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-black/50 border border-bright-yellow pixel-text text-xs rounded text-bright-yellow">
                  Canvas API
                </span>
                <span className="px-3 py-1 bg-black/50 border border-bright-yellow pixel-text text-xs rounded text-bright-yellow">
                  requestAnimationFrame
                </span>
                <span className="px-3 py-1 bg-black/50 border border-bright-yellow pixel-text text-xs rounded text-bright-yellow">
                  60 FPS
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Open Source */}
        <section className="text-center p-8 bg-black/30 border-2 border-bright-green rounded-lg">
          <h2 className="pixel-text text-2xl text-bright-green mb-4">{t.about.openSource}</h2>
          <p className="pixel-text text-sm mb-6" style={{ color: '#00f0ff' }}>
            {t.about.openSourceText}
          </p>
          <a
            href="https://github.com/devlikebear/gamehub"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-bright-green/20 border-2 border-bright-green text-bright-green pixel-text text-xs hover:bg-bright-green/10 transition-all duration-300 rounded"
          >
            {t.about.viewOnGithub}
          </a>
        </section>
      </div>
    </main>
  );
}
