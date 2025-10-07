import Link from 'next/link';

const games = [
  {
    id: 'neon-serpent',
    name: 'NEON SERPENT',
    icon: '🐍',
    color: 'green',
    difficulty: '⭐',
    description: '모듈형 네온 필드를 누비며 에너지 오브를 수집하세요',
    controls: '방향키로 이동, Shift 대시',
    status: 'playable',
    href: '/games/neon-serpent',
  },
  {
    id: 'pulse-paddles',
    name: 'PULSE PADDLES',
    icon: '🏓',
    color: 'pink',
    difficulty: '⭐',
    description: '곡선 궤적의 에너지 볼을 반사해 네온 골을 기록하세요',
    controls: '↑↓ 패들 제어, Space 커브샷',
    status: 'playable',
    href: '/games/pulse-paddles',
  },
  {
    id: 'prism-smash',
    name: 'PRISM SMASH',
    icon: '🧊',
    color: 'cyan',
    difficulty: '⭐⭐',
    description: '가변 패턴의 프리즘 블록을 해체하며 모듈을 수집하세요',
    controls: '←→ 패들 이동, Space 필드 스왑',
    status: 'playable',
    href: '/games/prism-smash',
  },
  {
    id: 'cascade-blocks',
    name: 'CASCADE BLOCKS',
    icon: '🔷',
    color: 'cyan',
    difficulty: '⭐⭐⭐',
    description: '비정형 에너지 모듈로 네온 격자를 안정화하고 필드 게이지를 유지하세요',
    controls: '방향키 이동/회전, Space 하드 드롭',
    status: 'playable',
    href: '/games/cascade-blocks',
  },
  {
    id: 'photon-vanguard',
    name: 'PHOTON VANGUARD',
    icon: '🛡️',
    color: 'yellow',
    difficulty: '⭐⭐⭐',
    description: '방사형 궤도로 진입하는 포톤 군단을 시간 왜곡으로 제압하세요',
    controls: '←→ 이동, Space 파동 발사',
    status: 'coming-soon',
  },
  {
    id: 'spectral-pursuit',
    name: 'SPECTRAL PURSUIT',
    icon: '🔮',
    color: 'yellow',
    difficulty: '⭐⭐⭐⭐',
    description: '개방형 라비린스에서 추적자를 교란하며 빛의 파편을 모으세요',
    controls: '방향키 이동, Space 위장',
    status: 'coming-soon',
  },
  {
    id: 'starshard-drift',
    name: 'STARSHARD DRIFT',
    icon: '☄️',
    color: 'purple',
    difficulty: '⭐⭐⭐⭐',
    description: '중력 파동을 이용해 크리스털 파편을 분해하고 에너지를 회수하세요',
    controls: '방향키 회전/추진, Space 펄스',
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

const playButtonClasses = {
  green: 'border-bright-green text-bright-green hover:bg-bright-green hover:text-black',
  pink: 'border-bright-pink text-bright-pink hover:bg-bright-pink hover:text-black',
  cyan: 'border-bright-cyan text-bright hover:bg-bright-cyan hover:text-black',
  yellow: 'border-bright-yellow text-bright-yellow hover:bg-bright-yellow hover:text-black',
  purple: 'border-bright-purple text-bright-purple hover:bg-bright-purple hover:text-black',
} as const;

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
              {game.status === 'playable' && (
                <div className="absolute top-4 right-4">
                  <span className="pixel-text text-bright-green text-xs bg-black/80 px-2 py-1 rounded border border-bright-green">
                    LIVE
                  </span>
                </div>
              )}

              {/* Play Button */}
              <div className="text-center">
                {game.status === 'coming-soon' ? (
                  <button
                    disabled
                    className="pixel-text text-xs px-6 py-2 rounded bg-black/50 border border-gray-600 text-gray-600 cursor-not-allowed"
                  >
                    COMING SOON
                  </button>
                ) : (
                  <Link
                    href={game.href ?? '#'}
                    className={`pixel-text text-xs px-6 py-2 rounded border-2 transition-all duration-300 inline-block ${
                      playButtonClasses[game.color as keyof typeof playButtonClasses]
                    }`}
                  >
                    PLAY
                  </Link>
                )}
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
