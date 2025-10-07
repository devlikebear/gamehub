export default function AboutPage() {
  return (
    <main className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="pixel-text text-4xl md:text-6xl text-bright mb-6 neon-text">
            ABOUT GAMEHUB
          </h1>
          <p className="text-bright text-lg md:text-xl">
            추억의 고전 아케이드 게임을 브라우저에서 즐기는 온라인 오락실
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-16 p-8 bg-black/50 border-2 border-bright-cyan rounded-lg">
          <h2 className="pixel-text text-2xl text-bright-pink mb-6">🎯 OUR MISSION</h2>
          <p className="text-bright leading-relaxed mb-4">
            GameHub는 80-90년대 아케이드 오락실의 향수를 불러일으키며,
            누구나 쉽게 접근할 수 있는 클래식 게임들을 제공합니다.
          </p>
          <p className="text-bright leading-relaxed">
            로그인이나 설치 없이 바로 플레이할 수 있으며,
            모든 게임은 완전 무료이고 광고도 없습니다.
          </p>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="pixel-text text-2xl text-bright-yellow mb-8 text-center">
            CORE VALUES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-black/30 border-2 border-bright-green rounded-lg">
              <div className="text-4xl mb-3">🕹️</div>
              <h3 className="pixel-text text-bright-green text-sm mb-3">RETRO VIBES</h3>
              <p className="text-bright text-sm">
                80-90년대 아케이드 오락실의 네온 감성과 픽셀 아트를 재현했습니다.
              </p>
            </div>

            <div className="p-6 bg-black/30 border-2 border-bright-cyan rounded-lg">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="pixel-text text-bright text-sm mb-3">INSTANT PLAY</h3>
              <p className="text-bright text-sm">
                복잡한 설정 없이 클릭 한 번으로 바로 게임을 시작할 수 있습니다.
              </p>
            </div>

            <div className="p-6 bg-black/30 border-2 border-bright-pink rounded-lg">
              <div className="text-4xl mb-3">🎮</div>
              <h3 className="pixel-text text-bright-pink text-sm mb-3">EASY CONTROLS</h3>
              <p className="text-bright text-sm">
                직관적인 방향키와 간단한 조작으로 누구나 쉽게 즐길 수 있습니다.
              </p>
            </div>

            <div className="p-6 bg-black/30 border-2 border-bright-purple rounded-lg">
              <div className="text-4xl mb-3">🆓</div>
              <h3 className="pixel-text text-bright-purple text-sm mb-3">FREE & OPEN</h3>
              <p className="text-bright text-sm">
                완전 무료이며 오픈소스로 누구나 기여할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-16 p-8 bg-black/50 border-2 border-bright-purple rounded-lg">
          <h2 className="pixel-text text-2xl text-bright-yellow mb-6">⚙️ TECH STACK</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-bright-pink font-bold mb-2">Frontend</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-black/50 border border-bright-cyan text-bright text-sm rounded">
                  Next.js 15
                </span>
                <span className="px-3 py-1 bg-black/50 border border-bright-cyan text-bright text-sm rounded">
                  TypeScript
                </span>
                <span className="px-3 py-1 bg-black/50 border border-bright-cyan text-bright text-sm rounded">
                  Tailwind CSS 4
                </span>
                <span className="px-3 py-1 bg-black/50 border border-bright-cyan text-bright text-sm rounded">
                  HTML5 Canvas
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-bright-pink font-bold mb-2">Infrastructure</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-black/50 border border-bright-green text-bright text-sm rounded">
                  Cloudflare Pages
                </span>
                <span className="px-3 py-1 bg-black/50 border border-bright-green text-bright text-sm rounded">
                  Edge Network
                </span>
                <span className="px-3 py-1 bg-black/50 border border-bright-green text-bright text-sm rounded">
                  Auto SSL
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-bright-pink font-bold mb-2">Game Engine</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-black/50 border border-bright-yellow text-bright text-sm rounded">
                  Canvas API
                </span>
                <span className="px-3 py-1 bg-black/50 border border-bright-yellow text-bright text-sm rounded">
                  requestAnimationFrame
                </span>
                <span className="px-3 py-1 bg-black/50 border border-bright-yellow text-bright text-sm rounded">
                  60 FPS
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Open Source */}
        <section className="text-center p-8 bg-black/30 border-2 border-bright-green rounded-lg">
          <h2 className="pixel-text text-2xl text-bright-green mb-4">OPEN SOURCE</h2>
          <p className="text-bright mb-6">
            GameHub는 오픈소스 프로젝트입니다.
            누구나 GitHub에서 소스코드를 확인하고 기여할 수 있습니다.
          </p>
          <a
            href="https://github.com/devlikebear/gamehub"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-bright-green/20 border-2 border-bright-green text-bright-green pixel-text text-sm hover:bg-bright-green hover:text-black transition-all duration-300 rounded"
          >
            VIEW ON GITHUB
          </a>
        </section>
      </div>
    </main>
  );
}
