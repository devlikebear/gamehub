export const ko = {
  // Common
  common: {
    games: '게임',
    leaderboard: '리더보드',
    about: '소개',
    contact: '연락',
    playNow: '지금 플레이',
    viewOnGithub: 'GitHub에서 보기',
    enterTheArcade: '오락실 입장',
    browseGameList: '게임 목록 보기',
    footerDescription: '추억의 고전 아케이드 게임을 브라우저에서 즐겨보세요',
    links: 'Links',
    connect: 'Connect',
    openSource: 'Open Source Project',
  },

  // Home Page
  home: {
    title: 'GAMEHUB',
    subtitle: 'NEON ARCADE UNIVERSE',
    description: '고전 아케이드 오락실의 스페이스 슈터 감성을 오리지널 메커니즘으로 재해석했습니다. 새롭게 공개된 Stellar Salvo를 포함해 모든 타이틀이 정식 플레이 가능!',
    features: {
      original: {
        title: '100% ORIGINAL IP',
        description: '자작된 작품 없는 내온 아케이드 세계관',
      },
      playable: {
        title: 'PLAYABLE NOW',
        description: '브라우저에서 즉시 시작 · 설치 불필요',
      },
      canvas: {
        title: 'CANVAS ENGINE',
        description: 'HTML5 캔버스로 구현한 60FPS 게임 루프',
      },
    },
    featuredGames: 'FEATURED TITLES',
    callToAction: '모든 게임은 브라우저에서 즉시 실행됩니다! 자작된 컨셉이 없는 오리지널 컨텐츠입니다. 더 많은 내온 아케이드를 만들 수 있도록 피드백과 아이디어를 보내주세요!',
  },

  // Game specific
  games: {
    'stellar-salvo': {
      name: 'STELLAR SALVO',
      tagline: 'NEW TITLE',
      description: '일정 패드로 따라 VOID WRAITH를 견제하는 내온 디펜스 슈팅',
    },
    'photon-vanguard': {
      name: 'PHOTON VANGUARD',
      description: '사각 방어권 파동 방어로 포문 근접을 막아내는 레드 슈팅',
    },
    'spectral-pursuit': {
      name: 'SPECTRAL PURSUIT',
      description: '위장을 유지하며 리바이언스를 빠아내는 내온 스텔스 추격전',
    },
    'cascade-blocks': {
      name: 'CASCADE BLOCKS',
      description: '같은 공향을 이어가는 내온 퍼즐',
    },
    'starshard-drift': {
      name: 'STARSHARD DRIFT',
      description: '중력을 활용한 스타샤드 수집 게임',
    },
    'neon-serpent': {
      name: 'NEON SERPENT',
      description: '네온 뱀 클래식 게임',
    },
    'pulse-paddles': {
      name: 'PULSE PADDLES',
      description: '펄스 패들 아케이드 게임',
    },
    'prism-smash': {
      name: 'PRISM SMASH',
      description: '프리즘 벽돌깨기 게임',
    },
  },

  // Leaderboard
  leaderboard: {
    title: 'NEON HALL OF FAME',
    subtitle: 'Global Leaderboards',
    description: '각 게임에서 기록한 최고 점수는 상위 100위까지 클라우드에 저장됩니다. 하위 점수와 개인 기록은 브라우저에 안전하게 보관돼요.',
    myBestRank: 'MY BEST RANK',
    top100: 'TOP 100',
    rank: 'Rank',
    pilot: 'Pilot',
    score: 'Score',
    recorded: 'Recorded',
    loading: 'Loading leaderboard...',
    error: '리더보드를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
    noEntries: '아직 등록된 기록이 없습니다. 가장 먼저 랭킹을 올려보세요!',
    backToGameList: 'Back to Game List',
    nicknameNote: '닉네임이 마음에 들지 않으면 게임 내에서 새 점수를 등록할 때마다 자동으로 생성된 다른 이름을 선택할 수 있어요.',
  },

  // About
  about: {
    title: 'About GameHub',
    mission: '우리의 미션',
    missionText: 'GameHub는 클래식 아케이드 게임의 감성을 현대적으로 재해석한 오리지널 게임 플랫폼입니다.',
    coreValues: 'Core Values',
    values: {
      original: {
        title: '100% 오리지널',
        description: '모든 게임은 직접 제작한 독창적인 콘텐츠',
      },
      opensource: {
        title: '오픈소스',
        description: '누구나 코드를 보고 배울 수 있음',
      },
      free: {
        title: '영원히 무료',
        description: '광고 없이 순수하게 즐기는 게임',
      },
      community: {
        title: '커뮤니티 중심',
        description: '피드백을 바탕으로 함께 만들어가는 게임',
      },
    },
    techStack: '기술 스택',
    openSource: '오픈소스',
    openSourceText: '이 프로젝트는 오픈소스입니다. GitHub에서 코드를 확인하고 기여할 수 있습니다.',
  },
};

export type Translations = typeof ko;
