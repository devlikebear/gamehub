import type { Translations } from './ko';

export const en: Translations = {
  // Common
  common: {
    games: 'Games',
    leaderboard: 'Leaderboard',
    about: 'About',
    contact: 'Contact',
    playNow: 'Play Now',
    viewOnGithub: 'View on GitHub',
    enterTheArcade: 'Enter the Arcade',
    browseGameList: 'Browse Game List',
    footerDescription: 'Experience classic arcade games in your browser',
    links: 'Links',
    connect: 'Connect',
    openSource: 'Open Source Project',
  },

  // Home Page
  home: {
    title: 'GAMEHUB',
    subtitle: 'NEON ARCADE UNIVERSE',
    description: 'Classic arcade space shooter vibes reimagined with original mechanics. All titles including the newly launched Stellar Salvo are fully playable!',
    features: {
      original: {
        title: '100% ORIGINAL IP',
        description: 'Handcrafted neon arcade universe',
      },
      playable: {
        title: 'PLAYABLE NOW',
        description: 'Start instantly in browser · No install',
      },
      canvas: {
        title: 'CANVAS ENGINE',
        description: 'HTML5 canvas-powered 60FPS game loop',
      },
    },
    featuredGames: 'FEATURED TITLES',
    callToAction: 'All games run instantly in your browser with zero derived concepts! Send feedback and ideas to help create more neon arcade titles!',
  },

  // Game UI (common across all games)
  gameUI: {
    score: 'Score',
    highScore: 'High Score',
    level: 'Level',
    lives: 'Lives',
    time: 'Time',
    paused: 'Paused',
    gameOver: 'Game Over',
    pressSpace: 'Press Space to Start',
    pressEnter: 'Press Enter to Start',
    controls: 'Controls',
    backToMenu: 'Back to Menu',
    playAgain: 'Play Again',
    submitScore: 'Submit Score',
    leaderboard: 'Leaderboard',
    topScores: 'Top Scores',
    yourScore: 'Your Score',
    enterNickname: 'Enter Nickname',
    loading: 'Loading...',
  },

  // Game specific
  games: {
    'stellar-salvo': {
      name: 'STELLAR SALVO',
      tagline: 'NEW TITLE',
      description: 'Track VOID WRAITH patterns across shifting defense tiles',
    },
    'photon-vanguard': {
      name: 'PHOTON VANGUARD',
      description: 'Radial wave defense against incoming barrage threats',
    },
    'spectral-pursuit': {
      name: 'SPECTRAL PURSUIT',
      description: 'Maintain stealth while outmaneuvering Revenants',
    },
    'cascade-blocks': {
      name: 'CASCADE BLOCKS',
      description: 'Match cascading color sequences',
    },
    'starshard-drift': {
      name: 'STARSHARD DRIFT',
      description: 'Collect starshards using gravity mechanics',
    },
    'neon-serpent': {
      name: 'NEON SERPENT',
      description: 'Classic neon snake game',
    },
    'pulse-paddles': {
      name: 'PULSE PADDLES',
      description: 'Pulse paddle arcade game',
    },
    'prism-smash': {
      name: 'PRISM SMASH',
      description: 'Prism breakout game',
    },
  },

  // Leaderboard
  leaderboard: {
    title: 'NEON HALL OF FAME',
    subtitle: 'Global Leaderboards',
    description: 'Top 100 scores for each game are saved to the cloud. Lower scores and personal records are safely stored in your browser.',
    myBestRank: 'MY BEST RANK',
    top100: 'TOP 100',
    rank: 'Rank',
    pilot: 'Pilot',
    score: 'Score',
    recorded: 'Recorded',
    loading: 'Loading leaderboard...',
    error: 'Failed to load leaderboard. Please try again later.',
    noEntries: 'No records yet. Be the first to claim the top spot!',
    backToGameList: 'Back to Game List',
    nicknameNote: 'Don\'t like your nickname? A new randomly generated name is assigned each time you submit a score in-game.',
  },

  // Games Page
  gamesPage: {
    title: 'GAME ARCADE',
    subtitle: 'NEON DEFENSE · RETRO SHOOTERS · PUZZLE FUSION',
    description: 'All titles are playable in this original neon arcade. Hover or click cards to preview games, then jump right into your favorite titles.',
    spotlight: 'Game Spotlight',
    difficulty: 'Difficulty',
    playable: 'Playable',
    comingSoon: 'Coming Soon',
    play: 'PLAY',
    previewNote: 'This area updates based on card selection. Click the play button to launch the game.',
    feedbackNote: 'Got a neon game idea? Send it our way! Community feedback drives the creation of new original titles.',
  },

  // About
  about: {
    title: 'ABOUT GAMEHUB',
    subtitle: 'Experience classic arcade games in your browser',
    mission: 'OUR MISSION',
    missionText1: 'GameHub evokes nostalgia for 80s-90s arcade parlors, providing easily accessible classic games for everyone.',
    missionText2: 'No login or installation required - just click and play. All games are completely free with no ads.',
    coreValues: 'CORE VALUES',
    values: {
      retro: {
        title: 'RETRO VIBES',
        description: 'Recreating the neon aesthetics and pixel art of 80s-90s arcade parlors.',
      },
      instant: {
        title: 'INSTANT PLAY',
        description: 'Start playing with a single click - no complex setup required.',
      },
      easy: {
        title: 'EASY CONTROLS',
        description: 'Intuitive arrow keys and simple controls anyone can enjoy.',
      },
      free: {
        title: 'FREE & OPEN',
        description: 'Completely free and open source - everyone can contribute.',
      },
    },
    techStack: 'TECH STACK',
    frontend: 'Frontend',
    infrastructure: 'Infrastructure',
    gameEngine: 'Game Engine',
    openSource: 'OPEN SOURCE',
    openSourceText: 'GameHub is an open source project. Anyone can check the source code and contribute on GitHub.',
    viewOnGithub: 'VIEW ON GITHUB',
  },
};
