const games = [
  {
    id: 'snake',
    name: 'SNAKE',
    icon: '🐍',
    color: 'green',
    difficulty: '⭐',
    description: '뱀을 조종하여 먹이를 먹고 점수를 획득하세요',
    controls: '방향키로 이동',
    status: 'coming-soon',
  },
  {
    id: 'pong',
    name: 'PONG',
    icon: '🏓',
    color: 'pink',
    difficulty: '⭐',
    description: '클래식 탁구 게임으로 공을 쳐서 점수를 얻으세요',
    controls: '↑↓ 키로 패들 조작',
    status: 'coming-soon',
  },
  {
    id: 'breakout',
    name: 'BREAKOUT',
    icon: '🧱',
    color: 'cyan',
    difficulty: '⭐⭐',
    description: '패들로 공을 쳐서 모든 벽돌을 깨트리세요',
    controls: '←→ 키로 패들 이동',
    status: 'coming-soon',
  },
  {
    id: 'tetris',
    name: 'TETRIS',
    icon: '🟦',
    color: 'cyan',
    difficulty: '⭐⭐⭐',
    description: '블록을 회전시켜 라인을 완성하세요',
    controls: '방향키로 조작',
    status: 'coming-soon',
  },
  {
    id: 'space-invaders',
    name: 'SPACE INVADERS',
    icon: '👾',
    color: 'yellow',
    difficulty: '⭐⭐⭐',
    description: '우주선을 조종하여 외계인을 격추하세요',
    controls: '←→ 이동, Space 발사',
    status: 'coming-soon',
  },
  {
    id: 'pacman',
    name: 'PAC-MAN',
    icon: '👻',
    color: 'yellow',
    difficulty: '⭐⭐⭐⭐',
    description: '미로에서 점을 먹고 유령을 피하세요',
    controls: '방향키로 이동',
    status: 'coming-soon',
  },
  {
    id: 'asteroids',
    name: 'ASTEROIDS',
    icon: '☄️',
    color: 'purple',
    difficulty: '⭐⭐⭐⭐',
    description: '우주선으로 운석을 파괴하세요',
    controls: '방향키 회전/이동, Space 발사',
    status: 'coming-soon',
  },
];

const colorClasses = {
  green: 'border-bright-green hover:shadow-neon-green',
  pink: 'border-bright-pink hover:shadow-neon-pink',
  cyan: 'border-bright-cyan hover:shadow-neon-cyan',
  yellow: 'border-bright-yellow hover:shadow-neon-yellow',
  purple: 'border-bright-purple hover:shadow-neon-purple',
};

const textColorClasses = {
  green: 'text-bright-green',
  pink: 'text-bright-pink',
  cyan: 'text-bright',
  yellow: 'text-bright-yellow',
  purple: 'text-bright-purple',
};

export default function GamesPage() {
  return (
    <main className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <section className="text-center mb-16">
          <h1 className="pixel-text text-4xl md:text-6xl text-bright mb-4 neon-text">
            GAME ARCADE
          </h1>
          <p className="text-bright-pink pixel-text text-sm mb-2">
            CHOOSE YOUR GAME
          </p>
          <p className="text-bright text-lg">
            클래식 아케이드 게임을 선택하고 최고 점수에 도전하세요
          </p>
        </section>

        {/* Games Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {games.map((game) => (
            <div
              key={game.id}
              className={`group relative p-6 bg-black/50 border-2 ${
                colorClasses[game.color as keyof typeof colorClasses]
              } rounded-lg transition-all duration-300 ${
                game.status === 'coming-soon'
                  ? 'cursor-not-allowed opacity-70 hover:opacity-90'
                  : 'cursor-pointer hover:scale-105'
              }`}
            >
              {/* Game Icon */}
              <div className="text-6xl mb-4 text-center">{game.icon}</div>

              {/* Game Name */}
              <h2
                className={`pixel-text text-sm text-center mb-2 ${
                  textColorClasses[game.color as keyof typeof textColorClasses]
                }`}
              >
                {game.name}
              </h2>

              {/* Difficulty */}
              <div className="text-center mb-3">
                <span className="text-bright-yellow text-sm">{game.difficulty}</span>
              </div>

              {/* Description */}
              <p className="text-bright text-xs text-center mb-3 leading-relaxed">
                {game.description}
              </p>

              {/* Controls */}
              <div className="text-center mb-4">
                <p className="text-bright-purple text-xs">{game.controls}</p>
              </div>

              {/* Status Badge */}
              {game.status === 'coming-soon' && (
                <div className="absolute top-4 right-4">
                  <span className="pixel-text text-bright-yellow text-xs bg-black/80 px-2 py-1 rounded border border-bright-yellow">
                    SOON
                  </span>
                </div>
              )}

              {/* Play Button (disabled for now) */}
              <div className="text-center">
                <button
                  disabled={game.status === 'coming-soon'}
                  className={`pixel-text text-xs px-6 py-2 rounded transition-all duration-300 ${
                    game.status === 'coming-soon'
                      ? 'bg-black/50 border border-gray-600 text-gray-600 cursor-not-allowed'
                      : `bg-${game.color}-500/20 border-2 border-${game.color}-500 text-${game.color}-500 hover:bg-${game.color}-500 hover:text-black`
                  }`}
                >
                  {game.status === 'coming-soon' ? 'COMING SOON' : 'PLAY'}
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Info Box */}
        <section className="max-w-2xl mx-auto p-6 bg-black/50 border-2 border-bright-cyan rounded-lg text-center">
          <p className="pixel-text text-bright-cyan text-sm mb-2">UNDER CONSTRUCTION</p>
          <p className="text-bright text-sm">
            게임들이 곧 준비됩니다! 각 게임은 순차적으로 개발되어 공개될 예정입니다.
          </p>
        </section>
      </div>
    </main>
  );
}
