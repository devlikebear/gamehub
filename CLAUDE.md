# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

GameHub는 추억의 고전 아케이드 게임을 브라우저에서 즐길 수 있는 온라인 오락실입니다. DevHub 프로젝트의 아키텍처를 기반으로 간단하고 재미있는 클래식 게임들을 웹에서 제공합니다.

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Game Engine**: HTML5 Canvas API
- **Hosting**: Cloudflare Pages
- **Package Manager**: npm

## 개발 명령어

### 기본 개발
```bash
# 개발 서버 시작 (Turbopack 사용)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start

# 린터 실행
npm run lint
```

### 테스트
```bash
# 테스트 실행
npm test

# 테스트 watch 모드
npm run test:watch

# 테스트 커버리지 확인
npm run test:coverage
```

## 아키텍처

### App Router 구조

프로젝트는 Next.js 15의 App Router를 사용하며, 다음과 같은 구조를 따릅니다:

```
app/
├── layout.tsx              # 루트 레이아웃 (Navbar, Footer, Providers 포함)
├── page.tsx                # 홈 페이지 (오락실 메인 화면)
├── games/                  # 게임 디렉토리
│   ├── [game-name]/       # 개별 게임 페이지
│   │   ├── page.tsx       # 게임 페이지 컴포넌트
│   │   ├── layout.tsx     # 게임별 레이아웃 (선택적)
│   │   └── metadata.ts    # SEO 메타데이터
│   └── page.tsx           # 게임 목록 페이지
├── leaderboard/            # 리더보드 페이지
├── about/                  # 소개 페이지
└── contact/                # 연락처 페이지
```

### 컴포넌트 구조

컴포넌트는 기능별로 분류되며, 재사용성과 유지보수성을 고려합니다:

```
components/
├── layout/                 # 레이아웃 컴포넌트
│   ├── Navbar.tsx         # 네비게이션 바
│   └── Footer.tsx         # 푸터
├── ui/                     # 재사용 가능한 UI 컴포넌트
│   ├── arcade/            # 아케이드 스타일 UI 컴포넌트
│   │   ├── ArcadeCard.tsx      # 게임 카드
│   │   ├── ArcadeButton.tsx    # 레트로 스타일 버튼
│   │   ├── PixelText.tsx       # 픽셀 폰트 텍스트
│   │   └── ScoreDisplay.tsx    # 점수 표시
│   ├── PageTransition.tsx
│   └── Toast.tsx
├── games/                  # 게임 관련 컴포넌트
│   ├── GameCanvas.tsx     # 게임 캔버스 래퍼
│   ├── GameController.tsx # 게임 컨트롤러 (키보드/터치)
│   ├── GameProvider.tsx   # 게임 상태 관리
│   ├── GameOverModal.tsx  # 게임 오버 화면
│   └── PauseMenu.tsx      # 일시정지 메뉴
├── leaderboard/            # 리더보드 관련
│   ├── ScoreBoard.tsx     # 점수판
│   └── RankingList.tsx    # 랭킹 목록
├── shortcuts/              # 키보드 단축키 관련
│   ├── CommandPalette.tsx
│   └── KeyboardShortcutsHelp.tsx
├── i18n/                   # 다국어 지원
│   ├── I18nProvider.tsx
│   └── LanguageSwitcher.tsx
├── analytics/              # 분석
│   └── CloudflareAnalytics.tsx
├── pwa/                    # PWA 지원
│   └── ServiceWorkerRegistration.tsx
└── ClientProviders.tsx     # 클라이언트 Provider 래퍼
```

### 라이브러리 구조

게임 로직과 유틸리티 함수는 `lib/` 디렉토리에 위치합니다:

```
lib/
├── games/                  # 게임 엔진 및 로직
│   ├── engine/            # 공통 게임 엔진
│   │   ├── GameLoop.ts   # 게임 루프
│   │   ├── Physics.ts    # 물리 엔진
│   │   ├── Collision.ts  # 충돌 감지
│   │   └── Input.ts      # 입력 처리
│   ├── snake/             # 스네이크 게임
│   ├── tetris/            # 테트리스 게임
│   ├── breakout/          # 벽돌깨기 게임
│   └── pacman/            # 팩맨 게임
├── storage/                # 로컬 스토리지 관리
│   ├── scores.ts          # 점수 저장/불러오기
│   └── settings.ts        # 설정 저장/불러오기
├── i18n/                   # 다국어 지원
│   ├── dictionaries.ts    # 사전 관리
│   ├── locale.ts          # 로케일 감지
│   └── locales/           # 언어별 번역 파일
│       ├── ko.ts
│       └── en.ts
└── seo/                    # SEO 관련
    └── meta.ts            # 메타 태그 설정
```

## 핵심 패턴

### 1. 레트로 아케이드 디자인 시스템

프로젝트는 80-90년대 아케이드 오락실 감성을 채택합니다:

- 네온 컬러 팔레트 (핑크, 청록, 보라, 노랑)
- 픽셀 아트 스타일 아이콘 및 폰트
- CRT 스캔라인 효과
- 그리드 패턴 배경
- 글로우 및 네온 효과

**아케이드 컴포넌트 사용 예시**:
```tsx
import { ArcadeCard, ArcadeButton, PixelText } from '@/components/ui/arcade';

<ArcadeCard neonColor="cyan">
  <PixelText size="large">GAME START</PixelText>
  <ArcadeButton color="pink">PLAY</ArcadeButton>
</ArcadeCard>
```

### 2. 게임 엔진 아키텍처

모든 게임은 공통 게임 엔진을 기반으로 구현됩니다:

```typescript
// lib/games/engine/GameLoop.ts
class GameEngine {
  private rafId: number | null = null;
  private lastTime = 0;

  start() {
    this.rafId = requestAnimationFrame(this.loop);
  }

  private loop = (currentTime: number) => {
    const deltaTime = currentTime - this.lastTime;
    this.update(deltaTime);
    this.render();
    this.rafId = requestAnimationFrame(this.loop);
  }

  abstract update(deltaTime: number): void;
  abstract render(): void;
}
```

### 3. 게임 상태 관리

게임 상태는 React Context와 로컬 스토리지를 활용합니다:

```tsx
// components/games/GameProvider.tsx
interface GameState {
  score: number;
  level: number;
  isPaused: boolean;
  isGameOver: boolean;
}

// 로컬 스토리지에 최고 점수 저장
// lib/storage/scores.ts
export function saveHighScore(game: string, score: number): void;
export function getHighScore(game: string): number;
```

### 4. 입력 처리 (키보드 + 터치)

게임은 키보드와 터치 입력을 모두 지원합니다:

```typescript
// lib/games/engine/Input.ts
class InputHandler {
  // 키보드 입력
  keys: Set<string> = new Set();

  // 터치/마우스 입력
  touches: Map<number, { x: number; y: number }> = new Map();

  // 가상 조이스틱 (모바일)
  joystick: { x: number; y: number } = { x: 0, y: 0 };
}
```

### 5. 다국어 지원 (i18n)

- 기본 언어: 한국어 (ko)
- 지원 언어: 한국어, 영어
- Server Component에서 `getDictionary(locale)` 사용
- Client Component에서 `useI18n()` 훅 사용

## 새로운 게임 추가 가이드

1. **게임 로직 구현** (`lib/games/[game-name]/`)
   ```typescript
   // lib/games/snake/SnakeGame.ts
   import { GameEngine } from '../engine/GameLoop';

   export class SnakeGame extends GameEngine {
     update(deltaTime: number) {
       // 게임 로직 업데이트
     }

     render() {
       // 캔버스 렌더링
     }
   }
   ```

2. **게임 페이지 생성** (`app/games/[game-name]/page.tsx`)
   ```tsx
   'use client';
   import { GameCanvas } from '@/components/games/GameCanvas';
   import { SnakeGame } from '@/lib/games/snake/SnakeGame';

   export default function SnakePage() {
     return (
       <div className="arcade-container">
         <GameCanvas game={SnakeGame} />
       </div>
     );
   }
   ```

3. **메타데이터 설정** (`app/games/[game-name]/metadata.ts`)
   ```tsx
   import { Metadata } from 'next';

   export const metadata: Metadata = {
     title: 'Snake Game - GameHub Arcade',
     description: '클래식 스네이크 게임을 즐겨보세요',
   };
   ```

4. **게임 카드 추가** (게임 목록 페이지에 등록)
   ```tsx
   const games = [
     {
       id: 'snake',
       name: 'Snake',
       icon: '🐍',
       color: 'green',
       difficulty: 'easy',
     },
   ];
   ```

5. **i18n 번역 추가**
   - `lib/i18n/locales/ko.ts`
   - `lib/i18n/locales/en.ts`

## 디자인 시스템

### 컬러 시스템 (네온 아케이드 팔레트)
```css
/* Neon Colors */
--neon-pink: #ff10f0
--neon-cyan: #00f0ff
--neon-purple: #9d00ff
--neon-yellow: #ffff00
--neon-green: #00ff00

/* Backgrounds */
bg-gradient-to-br from-purple-900 via-black to-cyan-900  /* 메인 배경 */
bg-black/80                                               /* 게임 카드 */

/* Glow Effects */
shadow-[0_0_20px_rgba(255,16,240,0.5)]   /* 핑크 글로우 */
shadow-[0_0_20px_rgba(0,240,255,0.5)]    /* 시안 글로우 */

/* CRT Effect */
linear-gradient(transparent 50%, rgba(0,0,0,0.25) 50%)  /* 스캔라인 */
```

### 타이포그래피
- 제목: 픽셀 폰트 (Press Start 2P)
- 본문: 모던 폰트 (Inter)
- 점수: 모노스페이스 폰트

### 간격 시스템
- Tailwind 기본 스케일 (4px 단위) 사용
- 주요 간격: 4, 8, 16, 24, 32

### 반응형 브레이크포인트
- Mobile: < 640px (세로 모드, 터치 컨트롤)
- Tablet: 640px ~ 1024px (가로 모드 지원)
- Desktop: > 1024px (키보드 컨트롤)

## 게임 개발 원칙

### 1. 60 FPS 유지
- `requestAnimationFrame` 사용
- 델타 타임 기반 업데이트
- 캔버스 최적화 (더블 버퍼링)

### 2. 반응형 게임 화면
- 캔버스 크기 자동 조정
- 모바일/데스크톱 UI 분기
- 터치/키보드 입력 동시 지원

### 3. 즉시 플레이 가능
- 로딩 최소화
- 복잡한 튜토리얼 없이 직관적 조작
- 빠른 재시작

### 4. 로컬 스토리지 활용
- 최고 점수 기록
- 게임 설정 저장
- 서버 통신 없음 (완전 클라이언트 사이드)

## 성능 최적화

### 게임 성능
- Canvas 렌더링 최적화
- 오프스크린 캔버스 활용
- 객체 풀링 (Object Pooling)
- RAF (requestAnimationFrame) 최적화

### Core Web Vitals 목표
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### 최적화 전략
- Next.js Image 컴포넌트 사용
- 게임별 코드 스플리팅
- Font 최적화 (next/font)
- Turbopack 사용 (빌드 속도 향상)

## PWA 지원

- manifest.json 설정 (게임 아이콘)
- Service Worker 등록
- 오프라인 플레이 지원
- 홈 화면 추가 가능

## 배포

### Cloudflare Pages 자동 배포
1. `main` 브랜치에 push
2. Cloudflare Pages 자동 빌드
3. 2-3분 내 배포 완료

### 빌드 명령어
```bash
npm run build
```

### 환경 변수
환경 변수는 `.env.local` 파일에 설정 (Git에 커밋하지 않음)

## 코딩 컨벤션

- TypeScript strict 모드 사용
- ESLint 규칙 준수
- 게임 로직: 클래스 기반 OOP
- UI 컴포넌트: 함수형 React
- 컴포넌트명: PascalCase
- 파일명: camelCase (컴포넌트 제외)
- CSS: Tailwind CSS 클래스 사용 우선

## 참고사항

- 모든 게임은 클라이언트 사이드에서 실행
- 점수 데이터는 로컬 스토리지에 저장
- 반응형 디자인 필수 (모바일/데스크톱)
- 키보드 + 터치 입력 모두 지원
- 레트로 아케이드 감성 유지
- 접근성 (WCAG 2.1 AA) 준수
