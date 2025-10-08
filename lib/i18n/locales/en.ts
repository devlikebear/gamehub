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

  // About
  about: {
    title: 'About GameHub',
    mission: 'Our Mission',
    missionText: 'GameHub is an original game platform that modernly reinterprets the essence of classic arcade games.',
    coreValues: 'Core Values',
    values: {
      original: {
        title: '100% Original',
        description: 'Every game is uniquely crafted content',
      },
      opensource: {
        title: 'Open Source',
        description: 'Anyone can view and learn from the code',
      },
      free: {
        title: 'Forever Free',
        description: 'Pure gaming experience without ads',
      },
      community: {
        title: 'Community Driven',
        description: 'Built together based on your feedback',
      },
    },
    techStack: 'Tech Stack',
    openSource: 'Open Source',
    openSourceText: 'This project is open source. Check out the code and contribute on GitHub.',
  },
};
