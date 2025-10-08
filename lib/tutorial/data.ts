import type { GameTutorialContent } from './types';

/**
 * Tutorial content for all games
 */
export const tutorialData: Record<string, GameTutorialContent> = {
  'neon-serpent': {
    gameId: 'neon-serpent',
    title: 'Neon Serpent',
    titleKo: '네온 서펀트',
    overview:
      'A classic snake game with a neon twist. Navigate through a procedurally changing field and grow your serpent by collecting energy orbs.',
    overviewKo: '네온 스타일의 클래식 스네이크 게임입니다. 절차적으로 변화하는 필드를 누비며 에너지 구슬을 먹고 뱀을 성장시키세요.',
    objective: 'Collect as many energy orbs as possible without hitting walls or your own tail.',
    objectiveKo: '벽이나 자신의 꼬리에 부딪히지 않고 최대한 많은 에너지 구슬을 수집하세요.',
    keyboardControls: [
      { key: '↑', action: 'Move Up', actionKo: '위로 이동' },
      { key: '↓', action: 'Move Down', actionKo: '아래로 이동' },
      { key: '←', action: 'Move Left', actionKo: '왼쪽으로 이동' },
      { key: '→', action: 'Move Right', actionKo: '오른쪽으로 이동' },
      { key: 'Space', action: 'Pause', actionKo: '일시정지' },
    ],
    touchControls: [
      { key: '⬆️', action: 'Swipe Up', actionKo: '위로 스와이프' },
      { key: '⬇️', action: 'Swipe Down', actionKo: '아래로 스와이프' },
      { key: '⬅️', action: 'Swipe Left', actionKo: '왼쪽으로 스와이프' },
      { key: '➡️', action: 'Swipe Right', actionKo: '오른쪽으로 스와이프' },
    ],
    rules: [
      'Collect energy orbs to grow and score points',
      'Game Over if you hit walls or your own tail',
      'Center orbs give 2x points',
      'You cannot reverse direction instantly (no 180° turns)',
    ],
    rulesKo: [
      '에너지 구슬을 먹으면 성장하고 점수를 얻습니다',
      '벽이나 자신의 꼬리에 부딪히면 게임 오버',
      '중앙 구슬은 2배 점수를 제공합니다',
      '방향을 즉시 반대로 바꿀 수 없습니다 (180° 회전 불가)',
    ],
    tips: [
      'Plan your path ahead - think 2-3 moves in advance',
      'Use the center of the field for high-value orbs',
      'Create space for yourself by moving in circles',
      'Watch your tail length - longer means more obstacles',
    ],
    tipsKo: [
      '경로를 미리 계획하세요 - 2-3수 앞을 생각하세요',
      '높은 점수를 위해 필드 중앙을 활용하세요',
      '원을 그리며 움직여 공간을 확보하세요',
      '꼬리 길이를 주의하세요 - 길수록 장애물이 많아집니다',
    ],
    specialFeatures: ['Procedurally changing field patterns', 'EMP power-up to clear obstacles'],
    specialFeaturesKo: ['절차적으로 변화하는 필드 패턴', '장애물 제거 EMP 파워업'],
  },

  'pulse-paddles': {
    gameId: 'pulse-paddles',
    title: 'Pulse Paddles',
    titleKo: '펄스 패들',
    overview: 'Classic Pong-style game with AI opponent. Bounce the pulse ball and score goals.',
    overviewKo: 'AI 상대와 대결하는 클래식 퐁 게임. 펄스 볼을 튕겨 골을 넣으세요.',
    objective: 'First to reach 7 points wins the match.',
    objectiveKo: '먼저 7점을 얻으면 승리합니다.',
    keyboardControls: [
      { key: '↑', action: 'Move Paddle Up', actionKo: '패들 위로 이동' },
      { key: '↓', action: 'Move Paddle Down', actionKo: '패들 아래로 이동' },
      { key: 'Space', action: 'Pause', actionKo: '일시정지' },
    ],
    touchControls: [
      { key: '👆', action: 'Drag Paddle Up/Down', actionKo: '패들을 위/아래로 드래그' },
      { key: '👇', action: 'Follow your finger', actionKo: '손가락을 따라 이동' },
    ],
    rules: [
      'Ball bounces off paddles and top/bottom walls',
      'If you miss the ball, opponent scores 1 point',
      'First to 7 points wins',
      'Ball speed increases after each rally',
    ],
    rulesKo: [
      '볼은 패들과 상단/하단 벽에서 튕깁니다',
      '볼을 놓치면 상대방이 1점을 얻습니다',
      '먼저 7점을 얻으면 승리',
      '랠리가 진행될수록 볼 속도가 증가합니다',
    ],
    tips: [
      'Hit the ball with paddle edges for sharper angles',
      'Position yourself early - anticipate ball trajectory',
      'AI difficulty adapts to your skill level',
      'Center hits make the ball go straight',
    ],
    tipsKo: [
      '패들 가장자리로 치면 더 날카로운 각도로 튕깁니다',
      '미리 위치를 잡으세요 - 볼의 궤적을 예측하세요',
      'AI 난이도는 플레이어 실력에 적응합니다',
      '중앙으로 치면 볼이 직선으로 갑니다',
    ],
    specialFeatures: ['Adaptive AI opponent', 'Dynamic ball speed'],
    specialFeaturesKo: ['적응형 AI 상대', '동적 볼 속도'],
  },

  'prism-smash': {
    gameId: 'prism-smash',
    title: 'Prism Smash',
    titleKo: '프리즘 스매시',
    overview: 'Break all the prism blocks with your paddle and ball. Classic brick breaker with neon aesthetics.',
    overviewKo: '패들과 볼로 모든 프리즘 블록을 깨세요. 네온 스타일의 클래식 벽돌깨기.',
    objective: 'Clear all blocks to advance to the next level. Keep the ball in play.',
    objectiveKo: '모든 블록을 깨서 다음 레벨로 진행하세요. 볼을 놓치지 마세요.',
    keyboardControls: [
      { key: '←', action: 'Move Paddle Left', actionKo: '패들 왼쪽 이동' },
      { key: '→', action: 'Move Paddle Right', actionKo: '패들 오른쪽 이동' },
      { key: 'Space', action: 'Launch Ball / Pause', actionKo: '볼 발사 / 일시정지' },
    ],
    touchControls: [
      { key: '👆', action: 'Drag Paddle Left/Right', actionKo: '패들을 좌/우로 드래그' },
      { key: '👇', action: 'Tap to Launch Ball', actionKo: '탭하여 볼 발사' },
    ],
    rules: [
      'Break blocks by hitting them with the ball',
      'You lose a life if the ball falls off the bottom',
      'Clear all blocks to advance to next level',
      'Special blocks give bonus points',
      'Game over when all lives are lost',
    ],
    rulesKo: [
      '볼로 블록을 쳐서 깨세요',
      '볼이 아래로 떨어지면 생명이 1개 감소합니다',
      '모든 블록을 깨면 다음 레벨로 진행',
      '특수 블록은 보너스 점수를 제공합니다',
      '모든 생명을 잃으면 게임 오버',
    ],
    tips: [
      'Aim for the sides to create clearing chains',
      'Use paddle edges to control ball angle',
      'Prioritize breaking special blocks first',
      'Keep the ball bouncing at steep angles for more control',
    ],
    tipsKo: [
      '측면을 노려 연쇄 파괴를 만드세요',
      '패들 가장자리로 볼 각도를 조절하세요',
      '특수 블록을 우선적으로 깨세요',
      '가파른 각도로 볼을 튕겨 더 많은 제어력을 확보하세요',
    ],
    specialFeatures: ['Multiple block types', 'Power-ups', 'Progressive difficulty levels'],
    specialFeaturesKo: ['다양한 블록 타입', '파워업', '점진적 난이도 레벨'],
  },

  'cascade-blocks': {
    gameId: 'cascade-blocks',
    title: 'Color Match Cascade',
    titleKo: '컬러 매치 캐스케이드',
    overview: 'Match 4 or more blocks of the same color to clear them. Inspired by Puyo Puyo.',
    overviewKo: '같은 색 블록 4개 이상을 연결하여 제거하세요. Puyo Puyo에서 영감을 받았습니다.',
    objective: 'Clear blocks by matching colors. Survive as long as possible without reaching the top.',
    objectiveKo: '같은 색을 매칭하여 블록을 제거하세요. 맨 위에 닿지 않도록 최대한 오래 생존하세요.',
    keyboardControls: [
      { key: '←', action: 'Move Left', actionKo: '왼쪽 이동' },
      { key: '→', action: 'Move Right', actionKo: '오른쪽 이동' },
      { key: '↓', action: 'Drop Faster (Soft Drop)', actionKo: '빠르게 낙하 (소프트 드롭)' },
      { key: 'Space', action: 'Rotate Blocks', actionKo: '블록 회전' },
      { key: 'Shift', action: 'Hard Drop (Instant)', actionKo: '하드 드롭 (즉시)' },
    ],
    touchControls: [
      { key: '⬅️➡️', action: 'Swipe to Move', actionKo: '좌/우로 스와이프하여 이동' },
      { key: '⬇️', action: 'Swipe Down to Drop', actionKo: '아래로 스와이프하여 낙하' },
      { key: '🔄', action: 'Tap to Rotate', actionKo: '탭하여 회전' },
    ],
    rules: [
      'Match 4 or more blocks of the same color to clear them',
      'Cleared blocks cause upper blocks to fall (cascade)',
      'Combos give bonus points',
      'Game over if blocks reach the top line',
      'Preview next blocks to plan ahead',
    ],
    rulesKo: [
      '같은 색 블록 4개 이상을 연결하면 제거됩니다',
      '제거된 블록 위의 블록들이 떨어집니다 (캐스케이드)',
      '콤보는 보너스 점수를 제공합니다',
      '블록이 맨 위 라인에 닿으면 게임 오버',
      '다음 블록을 미리 보고 계획하세요',
    ],
    tips: [
      'Build upward combos for massive points',
      'Use preview to plan color placements',
      'Leave space in center columns for flexibility',
      'Chain reactions multiply your score',
      'Prioritize clearing near the top when space is tight',
    ],
    tipsKo: [
      '위로 쌓아 올리는 콤보로 높은 점수를 얻으세요',
      '미리보기를 활용해 색상 배치를 계획하세요',
      '중앙 열에 공간을 남겨 유연성을 확보하세요',
      '연쇄 반응으로 점수를 배가시키세요',
      '공간이 부족할 때는 상단 블록 제거를 우선하세요',
    ],
    specialFeatures: ['Cascade chain reactions', 'Next block preview', 'Combo multiplier system'],
    specialFeaturesKo: ['캐스케이드 연쇄 반응', '다음 블록 미리보기', '콤보 배수 시스템'],
  },

  'photon-vanguard': {
    gameId: 'photon-vanguard',
    title: 'Photon Vanguard',
    titleKo: '포톤 뱅가드',
    overview: 'Radial defense shooter. Protect the center from all directions and eliminate incoming threats.',
    overviewKo: '방사형 방어 슈팅 게임. 중앙을 사방에서 보호하고 다가오는 위협을 제거하세요.',
    objective: 'Survive waves of enemies and protect your core. Eliminate all threats.',
    objectiveKo: '적의 공격 웨이브에서 생존하고 코어를 보호하세요. 모든 위협을 제거하세요.',
    keyboardControls: [
      { key: '↑↓←→', action: 'Move in 8 Directions', actionKo: '8방향 이동' },
      { key: 'Space', action: 'Fire Photon Blast', actionKo: '포톤 발사' },
      { key: 'Shift', action: 'Auto-Fire Toggle', actionKo: '자동 발사 토글' },
    ],
    touchControls: [
      { key: '🎮', action: 'Virtual Joystick (Left)', actionKo: '가상 조이스틱 (왼쪽)' },
      { key: '🔫', action: 'Fire Button (Right)', actionKo: '발사 버튼 (오른쪽)' },
    ],
    rules: [
      'Enemies approach from all directions',
      'Shoot photon blasts to destroy enemies',
      'You lose health when enemies reach the center',
      'Game over when health reaches zero',
      'Waves get progressively harder',
    ],
    rulesKo: [
      '적들이 모든 방향에서 접근합니다',
      '포톤을 발사하여 적을 파괴하세요',
      '적이 중앙에 도달하면 체력이 감소합니다',
      '체력이 0이 되면 게임 오버',
      '웨이브가 진행될수록 어려워집니다',
    ],
    tips: [
      'Focus fire on the densest enemy clusters',
      'Keep moving to avoid being surrounded',
      'Prioritize fast-moving enemies',
      'Watch your ammo count and reload strategically',
      'Use auto-fire for sustained defense',
    ],
    tipsKo: [
      '가장 밀집한 적 무리에 집중 사격하세요',
      '포위되지 않도록 계속 이동하세요',
      '빠르게 움직이는 적을 우선 제거하세요',
      '탄약을 확인하고 전략적으로 재장전하세요',
      '지속적인 방어를 위해 자동 발사를 활용하세요',
    ],
    specialFeatures: ['360-degree threat detection', 'Wave-based progression', 'Power-up drops'],
    specialFeaturesKo: ['360도 위협 감지', '웨이브 기반 진행', '파워업 드롭'],
  },

  'spectral-pursuit': {
    gameId: 'spectral-pursuit',
    title: 'Spectral Pursuit',
    titleKo: '스펙트럴 퍼슈트',
    overview: 'Stealth maze game. Avoid spectral pursuers with vision cones and reach the goal.',
    overviewKo: '스텔스 미로 게임. 시야 범위를 가진 유령 추격자를 피해 목표 지점에 도달하세요.',
    objective: 'Navigate through levels without being caught by spectral pursuers.',
    objectiveKo: '유령 추격자에게 들키지 않고 레벨을 통과하세요.',
    keyboardControls: [
      { key: '↑', action: 'Move Up', actionKo: '위로 이동' },
      { key: '↓', action: 'Move Down', actionKo: '아래로 이동' },
      { key: '←', action: 'Move Left', actionKo: '왼쪽으로 이동' },
      { key: '→', action: 'Move Right', actionKo: '오른쪽으로 이동' },
      { key: 'Shift', action: 'Dash (Limited Use)', actionKo: '대시 (제한된 사용)' },
    ],
    touchControls: [
      { key: '🕹️', action: 'Virtual D-Pad', actionKo: '가상 십자키' },
      { key: '⚡', action: 'Dash Button', actionKo: '대시 버튼' },
    ],
    rules: [
      'Avoid spectral pursuers with vision cones',
      'If spotted, pursuers will chase you',
      'Getting caught results in game over',
      'Reach the goal marker to clear the level',
      'Dash has limited uses per level',
    ],
    rulesKo: [
      '시야 범위를 가진 유령 추격자를 피하세요',
      '발각되면 추격자가 쫓아옵니다',
      '잡히면 게임 오버',
      '목표 지점에 도달하면 레벨 클리어',
      '대시는 레벨당 제한된 횟수만 사용 가능합니다',
    ],
    tips: [
      'Stay outside vision cones - watch for red glow',
      'Use dash only in emergencies - save for critical moments',
      'Wait for pursuers to turn away before moving',
      'Corners and walls block vision',
      'Plan your route before moving',
    ],
    tipsKo: [
      '시야 범위 밖에 머무르세요 - 빨간 빛을 주의하세요',
      '대시는 긴급 상황에서만 사용하세요 - 중요한 순간을 위해 아끼세요',
      '추격자가 돌아서기를 기다린 후 이동하세요',
      '모서리와 벽은 시야를 차단합니다',
      '이동하기 전에 경로를 계획하세요',
    ],
    specialFeatures: ['Vision cone stealth mechanics', 'Dash ability', 'Multi-level progression'],
    specialFeaturesKo: ['시야 원뿔 스텔스 메커니즘', '대시 능력', '다중 레벨 진행'],
  },

  'starshard-drift': {
    gameId: 'starshard-drift',
    title: 'Starshard Drift',
    titleKo: '스타샤드 드리프트',
    overview: 'Gravity-manipulation puzzle game. Switch gravity directions to collect starshards.',
    overviewKo: '중력 조작 퍼즐 게임. 중력 방향을 전환하여 별파편을 수집하세요.',
    objective: 'Collect all starshards in each level by manipulating gravity.',
    objectiveKo: '중력을 조작하여 각 레벨의 모든 별파편을 수집하세요.',
    keyboardControls: [
      { key: '↑', action: 'Switch Gravity Up', actionKo: '중력 위로 전환' },
      { key: '↓', action: 'Switch Gravity Down', actionKo: '중력 아래로 전환' },
      { key: '←', action: 'Switch Gravity Left', actionKo: '중력 왼쪽으로 전환' },
      { key: '→', action: 'Switch Gravity Right', actionKo: '중력 오른쪽으로 전환' },
      { key: 'Space', action: 'Reset Level', actionKo: '레벨 재시작' },
    ],
    touchControls: [
      { key: '⬆️⬇️⬅️➡️', action: 'Swipe to Change Gravity', actionKo: '스와이프하여 중력 변경' },
      { key: '🔄', action: 'Tap Center to Reset', actionKo: '중앙 탭하여 재시작' },
    ],
    rules: [
      'Switch gravity to make your ship drift in that direction',
      'Collect all starshards to clear the level',
      'Avoid obstacles and hazards',
      'Collision with obstacles loses a life',
      'Use momentum and inertia to navigate',
    ],
    rulesKo: [
      '중력을 전환하여 우주선이 해당 방향으로 표류하게 만드세요',
      '모든 별파편을 수집하면 레벨 클리어',
      '장애물과 위험 요소를 피하세요',
      '장애물과 충돌하면 생명이 감소합니다',
      '관성과 가속도를 활용하여 이동하세요',
    ],
    tips: [
      'Timing is key - switch gravity at the right moment',
      'Use walls to redirect momentum',
      'Plan your gravity switches ahead of time',
      'Momentum carries - don\'t over-correct',
      'Practice makes perfect - levels have optimal solutions',
    ],
    tipsKo: [
      '타이밍이 핵심입니다 - 적절한 순간에 중력을 전환하세요',
      '벽을 활용하여 운동량을 변경하세요',
      '중력 전환을 미리 계획하세요',
      '관성이 유지됩니다 - 과도하게 조정하지 마세요',
      '연습이 완벽을 만듭니다 - 레벨에는 최적의 해결책이 있습니다',
    ],
    specialFeatures: ['Physics-based gravity manipulation', 'Momentum and inertia', 'Puzzle-based level design'],
    specialFeaturesKo: ['물리 기반 중력 조작', '운동량과 관성', '퍼즐 기반 레벨 디자인'],
  },

  'stellar-salvo': {
    gameId: 'stellar-salvo',
    title: 'Stellar Salvo',
    titleKo: '스텔라 살보',
    overview: 'Space shooter. Destroy asteroid fragments and survive the cosmic storm.',
    overviewKo: '우주 슈팅 게임. 소행성 파편을 파괴하고 우주 폭풍에서 생존하세요.',
    objective: 'Destroy all asteroids while avoiding collisions. Survive as long as possible.',
    objectiveKo: '충돌을 피하며 모든 소행성을 파괴하세요. 최대한 오래 생존하세요.',
    keyboardControls: [
      { key: '↑', action: 'Move Up', actionKo: '위로 이동' },
      { key: '↓', action: 'Move Down', actionKo: '아래로 이동' },
      { key: '←', action: 'Move Left', actionKo: '왼쪽으로 이동' },
      { key: '→', action: 'Move Right', actionKo: '오른쪽으로 이동' },
      { key: 'Space', action: 'Fire Lasers', actionKo: '레이저 발사' },
      { key: 'Shift', action: 'Shield Boost', actionKo: '실드 부스트' },
    ],
    touchControls: [
      { key: '🕹️', action: 'Virtual Joystick (Move)', actionKo: '가상 조이스틱 (이동)' },
      { key: '🔫', action: 'Auto-Fire / Tap to Fire', actionKo: '자동 발사 / 탭하여 발사' },
    ],
    rules: [
      'Large asteroids split into smaller fragments when hit',
      'Destroy all fragments to clear a wave',
      'Colliding with asteroids damages your ship',
      'Collect power-ups for weapon upgrades',
      'Game over when health reaches zero',
    ],
    rulesKo: [
      '큰 소행성은 맞으면 작은 파편으로 분열합니다',
      '모든 파편을 파괴하면 웨이브를 클리어합니다',
      '소행성과 충돌하면 우주선이 손상됩니다',
      '파워업을 수집하여 무기를 업그레이드하세요',
      '체력이 0이 되면 게임 오버',
    ],
    tips: [
      'Prioritize small fragments - they\'re faster and more dangerous',
      'Keep moving to avoid collisions',
      'Use shield boost when surrounded',
      'Power-ups appear after clearing waves',
      'Shoot from a safe distance when possible',
    ],
    tipsKo: [
      '작은 파편을 우선 처리하세요 - 더 빠르고 위험합니다',
      '충돌을 피하기 위해 계속 이동하세요',
      '포위되었을 때 실드 부스트를 사용하세요',
      '웨이브 클리어 후 파워업이 나타납니다',
      '가능하면 안전한 거리에서 발사하세요',
    ],
    specialFeatures: ['Asteroid fragmentation system', 'Power-up system', 'Shield mechanics'],
    specialFeaturesKo: ['소행성 분열 시스템', '파워업 시스템', '실드 메커니즘'],
  },
};

/**
 * Get tutorial content by game ID
 */
export function getTutorialContent(gameId: string): GameTutorialContent | undefined {
  return tutorialData[gameId];
}

/**
 * Get all tutorial contents
 */
export function getAllTutorialContents(): GameTutorialContent[] {
  return Object.values(tutorialData);
}
