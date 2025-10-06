export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative z-10">
      <div className="text-center space-y-8">
        {/* Logo */}
        <h1 className="pixel-text text-4xl md:text-6xl neon-text text-neon-cyan mb-4">
          GAMEHUB
        </h1>

        {/* Subtitle */}
        <p className="pixel-text text-sm md:text-base text-neon-pink">
          RETRO ARCADE
        </p>

        {/* Description */}
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          추억의 고전 아케이드 게임을 브라우저에서 즐겨보세요
        </p>

        {/* Coming Soon */}
        <div className="mt-12 p-8 bg-black/50 border-2 border-neon-purple rounded-lg shadow-neon-purple">
          <p className="pixel-text text-neon-yellow text-xs md:text-sm">
            COMING SOON
          </p>
          <p className="text-gray-400 mt-4 text-sm">
            곧 만나요! 🕹️
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
          <div className="p-4 bg-black/30 border border-neon-green rounded-lg hover:shadow-neon-green transition-all duration-300 cursor-not-allowed opacity-50">
            <div className="text-4xl mb-2">🐍</div>
            <p className="pixel-text text-xs text-gray-400">SNAKE</p>
          </div>
          <div className="p-4 bg-black/30 border border-neon-cyan rounded-lg hover:shadow-neon-cyan transition-all duration-300 cursor-not-allowed opacity-50">
            <div className="text-4xl mb-2">🟦</div>
            <p className="pixel-text text-xs text-gray-400">TETRIS</p>
          </div>
          <div className="p-4 bg-black/30 border border-neon-yellow rounded-lg hover:shadow-neon-yellow transition-all duration-300 cursor-not-allowed opacity-50">
            <div className="text-4xl mb-2">👾</div>
            <p className="pixel-text text-xs text-gray-400">PACMAN</p>
          </div>
          <div className="p-4 bg-black/30 border border-neon-pink rounded-lg hover:shadow-neon-pink transition-all duration-300 cursor-not-allowed opacity-50">
            <div className="text-4xl mb-2">🏓</div>
            <p className="pixel-text text-xs text-gray-400">PONG</p>
          </div>
        </div>
      </div>
    </main>
  );
}
