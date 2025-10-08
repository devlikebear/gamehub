# 🕹️ GameHub - Retro Arcade Games

추억의 고전 아케이드 게임을 브라우저에서 즐겨보세요!

[![Deploy with Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/devlikebear/gamehub)

## 🎮 Features

- 🕹️ **Original Neon Arcade Series**: Maze runners, paddle duels, falling blocks, asteroid drift and more
- 🎨 **Retro Design**: 80s-90s arcade aesthetic with neon colors
- 📱 **Responsive**: Play on mobile, tablet, or desktop
- ⚡ **Fast & Lightweight**: Built with Next.js 15 and Tailwind CSS 4
- 🔒 **Privacy First**: All games run in your browser, no data sent to servers
- 🆓 **Free & Open Source**: No ads, completely free to play
- 📲 **PWA Support**: Install as an app, play offline
- 🎵 **Retro BGM**: 8-bit style background music with volume controls

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Deployment

This project is optimized for Cloudflare Pages:

1. Fork this repository
2. Connect to Cloudflare Pages
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `out`
   - Node version: `20`

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Game Engine**: HTML5 Canvas API
- **Hosting**: Cloudflare Pages
- **Fonts**: Press Start 2P (pixel font), Inter

## 🎯 Games Roadmap

| Game | Difficulty | Status |
|------|-----------|--------|
| Neon Serpent | ⭐ | Playable (prototype) |
| Pulse Paddles | ⭐ | Playable (prototype) |
| Prism Smash | ⭐⭐ | Playable (prototype) |
| Color Match Cascade | ⭐⭐ | Playable (prototype) |
| Photon Vanguard | ⭐⭐⭐ | Playable |
| Spectral Pursuit | ⭐⭐⭐⭐ | Playable |
| Stellar Salvo | ⭐⭐⭐ | Playable |

## 🏆 Leaderboard

- Global leaderboard powered by Supabase (top 100 per game)
- Local browser storage keeps your personal rank snapshot
- API endpoint: `POST /api/leaderboard` (see `app/api/leaderboard/route.ts`)

## 📁 Project Structure

```
gamehub/
├── app/                    # Next.js App Router
│   ├── games/             # Game pages
│   ├── icon.svg           # Neon favicon for the arcade
│   └── ...
├── components/            # React components
│   ├── ui/arcade/        # Arcade-style UI components
│   ├── games/            # Game components
│   └── layout/           # Layout components
├── lib/                   # Game logic & utilities
│   ├── games/engine/     # Common game engine
│   └── storage/          # Local storage management
└── public/               # Static assets

```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning or building your own arcade!

## 🛡️ IP & Licensing

- All code and gameplay systems are authored from scratch; no ROMs, reverse engineering, or extracted assets are used.
- Visuals, audio, and fonts must be original creations or sourced from permissive licenses (CC0/CC-BY) with proper attribution.
- Game titles, characters, layouts, and UI are intentionally distinct from trademarked classics. Project branding avoids names such as Pac-Man, Tetris, Space Invaders, Pong, Breakout, or Asteroids.
- This project is an independent homage to arcade-era design and is not affiliated with or endorsed by the original rights holders.

## 🙏 Credits

Inspired by classic arcade games and retro gaming culture.

### Fonts

- **Press Start 2P** - Pixel font by CodeMan38 ([SIL OFL 1.1](https://scripts.sil.org/OFL))
- **Inter** - Modern sans-serif by Rasmus Andersson ([SIL OFL 1.1](https://scripts.sil.org/OFL))
- **DungGeunMo (둥근모꼴)** - Korean pixel font by jungu ([SIL OFL 1.1](https://scripts.sil.org/OFL)) - [Download](https://cactus.tistory.com/193)

### Audio Attribution

Background music by [Oblidivm](https://oblidivmmusic.blogspot.com) licensed under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/):
- The Challenge
- The Fun Begins
- The Labyrinth
- Survive
- Jump2Sky
- The Undefeated

Source: [OpenGameArt.org - Chiptune Music for Arcade Games](https://opengameart.org/content/chiptune-music-for-arcade-games)

For detailed credits and licensing information, see [CREDITS.md](./CREDITS.md).

---

**Made with ❤️ by devlikebear**
