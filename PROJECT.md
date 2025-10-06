# GameHub - 온라인 아케이드 오락실

## 📋 프로젝트 개요

### 목적
추억의 고전 아케이드 게임을 브라우저에서 즐길 수 있는 온라인 오락실. 간단하고 재미있는 클래식 게임들을 웹에서 무료로 제공하여 향수를 불러일으키고 즐거운 시간을 선사합니다.

### 핵심 가치
- 🕹️ **레트로 감성**: 80-90년대 아케이드 오락실 분위기
- ⚡ **즉시 플레이**: 로그인/설치 없이 바로 게임 시작
- 🎮 **간단한 조작**: 직관적인 컨트롤로 누구나 쉽게 플레이
- 📱 **어디서나**: 모바일/태블릿/데스크톱 완벽 대응
- 🆓 **무료 & 오픈소스**: 광고 없이 무료로 즐기기

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Game Engine**: HTML5 Canvas API
- **Fonts**: Press Start 2P (픽셀 폰트), Inter (본문)

### Infrastructure
- **Hosting**: Cloudflare Pages
- **Domain**: Cloudflare 관리
- **CDN**: Cloudflare Edge Network (275+ cities)
- **SSL**: 자동 발급 (Let's Encrypt)

### Development
- **Package Manager**: npm
- **Linter**: ESLint
- **Test**: Vitest
- **Version Control**: Git + GitHub

## 📁 프로젝트 구조

```
gamehub/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈 (오락실 메인)
│   ├── games/             # 게임 페이지들
│   │   ├── snake/         # 스네이크
│   │   ├── tetris/        # 테트리스
│   │   ├── breakout/      # 벽돌깨기
│   │   ├── pacman/        # 팩맨
│   │   ├── pong/          # 퐁
│   │   └── space-invaders/ # 스페이스 인베이더
│   ├── leaderboard/       # 리더보드
│   ├── about/             # 소개 페이지
│   └── contact/           # 연락처
├── components/            # 재사용 컴포넌트
│   ├── ui/               # UI 컴포넌트
│   │   └── arcade/       # 아케이드 스타일 UI
│   ├── games/            # 게임 공통 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   └── leaderboard/      # 리더보드 컴포넌트
├── lib/                  # 게임 로직 & 유틸리티
│   ├── games/            # 게임 엔진 및 개별 게임
│   │   ├── engine/       # 공통 게임 엔진
│   │   ├── snake/        # 스네이크 로직
│   │   ├── tetris/       # 테트리스 로직
│   │   └── ...
│   ├── storage/          # 로컬 스토리지 관리
│   └── i18n/             # 다국어 지원
├── public/               # 정적 파일
│   ├── sounds/           # 게임 효과음
│   ├── images/           # 게임 아이콘/스프라이트
│   └── fonts/            # 픽셀 폰트
└── styles/               # 글로벌 스타일
```

## 🎯 주요 기능 (로드맵)

### Phase 1: 기본 구조 🚧
- [ ] Next.js 프로젝트 초기 설정
- [ ] Tailwind CSS 설정 (네온 컬러 팔레트)
- [ ] 아케이드 테마 랜딩 페이지 구현
- [ ] Git 저장소 초기화
- [ ] 배포 가이드 작성

### Phase 2: 핵심 페이지 🚧
- [ ] Navigation Bar 컴포넌트 (네온 스타일)
- [ ] Footer 컴포넌트
- [ ] About (소개) 페이지
- [ ] Games 목록 페이지 (아케이드 캐비닛 스타일)
- [ ] Contact (연락처) 페이지

### Phase 3: 공통 게임 엔진 구현 🚧
- [ ] 게임 루프 엔진 (requestAnimationFrame)
- [ ] 입력 핸들러 (키보드 + 터치)
- [ ] 충돌 감지 시스템
- [ ] 점수 시스템
- [ ] 로컬 스토리지 관리 (최고 점수)
- [ ] 게임 공통 UI (일시정지, 게임오버, 재시작)

### Phase 4: 클래식 게임 구현

#### 우선순위 높음 (간단한 게임)
- [ ] **Snake (스네이크)**: 클래식 뱀 게임
  - 방향키로 이동
  - 먹이 먹고 점수 획득
  - 벽/자기 몸 충돌 시 게임 오버
  - 난이도: ⭐

- [ ] **Pong (퐁)**: 탁구 게임
  - 상/하 키로 패들 조작
  - AI 상대 또는 2인 플레이
  - 난이도: ⭐

- [ ] **Breakout (벽돌깨기)**: 클래식 벽돌깨기
  - 좌/우 키로 패들 이동
  - 공으로 벽돌 깨기
  - 난이도: ⭐⭐

#### 우선순위 중간
- [ ] **Tetris (테트리스)**: 블록 퍼즐 게임
  - 방향키로 블록 회전/이동
  - 라인 완성 시 제거
  - 난이도: ⭐⭐⭐

- [ ] **Space Invaders (스페이스 인베이더)**: 슈팅 게임
  - 좌/우 이동, 스페이스바 발사
  - 외계인 격추
  - 난이도: ⭐⭐⭐

#### 우선순위 낮음 (복잡한 게임)
- [ ] **Pac-Man (팩맨)**: 미로 게임
  - 방향키로 이동
  - 점 먹고 유령 피하기
  - 난이도: ⭐⭐⭐⭐

- [ ] **Asteroids (아스테로이드)**: 우주선 슈팅
  - 회전/이동/발사
  - 운석 파괴
  - 난이도: ⭐⭐⭐⭐

### Phase 5: 리더보드 & 소셜 기능
- [ ] 로컬 최고 점수 기록 (게임별)
- [ ] 리더보드 페이지
- [ ] 점수 공유 기능 (SNS)
- [ ] 친구 초대 기능

### Phase 6: 개선 & 최적화
- [ ] SEO 최적화 (메타 태그, sitemap)
- [ ] Open Graph 이미지 (게임별)
- [ ] 다국어 지원 (한국어/영어)
- [ ] 다크모드 토글 (기본: 다크)
- [ ] 게임 효과음 & BGM
- [ ] 애니메이션 효과 (CRT 스캔라인, 글로우)
- [ ] 성능 최적화 (Canvas, 코드 스플리팅)
- [ ] PWA 지원 (오프라인 플레이)

### Phase 7: 추가 기능
- [ ] 게임 통계 (플레이 시간, 플레이 횟수)
- [ ] 업적 시스템 (뱃지/트로피)
- [ ] 키보드 단축키 가이드
- [ ] 난이도 선택 (쉬움/보통/어려움)
- [ ] 방문자 통계 (Cloudflare Analytics)
- [ ] 게임 튜토리얼/설명

## 🎨 디자인 시스템

### 레트로 아케이드 콘셉트

**핵심 테마**: 80-90년대 아케이드 오락실

#### 컬러 팔레트 (네온 컬러)
```css
/* Primary Neon Colors */
--neon-pink: #ff10f0        /* 메인 강조 */
--neon-cyan: #00f0ff        /* 부가 강조 */
--neon-purple: #9d00ff      /* 배경 그라데이션 */
--neon-yellow: #ffff00      /* 점수/하이라이트 */
--neon-green: #00ff00       /* 성공 상태 */

/* Backgrounds */
--bg-dark: #0a0a0f          /* 메인 배경 */
--bg-game: #000000          /* 게임 화면 */
--bg-card: rgba(0,0,0,0.8)  /* 게임 카드 */

/* Text */
--text-primary: #ffffff     /* 주요 텍스트 */
--text-glow: #00f0ff        /* 글로우 텍스트 */
```

#### 타이포그래피
- **게임 타이틀**: Press Start 2P (픽셀 폰트)
- **본문**: Inter (가독성)
- **점수**: Courier New (모노스페이스)

#### UI 요소
- **게임 카드**: 블랙 배경 + 네온 테두리 + 글로우 효과
- **버튼**: 아케이드 버튼 스타일 + 호버 시 네온 글로우
- **점수판**: LED 디스플레이 스타일
- **배경**: 그리드 패턴 + CRT 스캔라인 효과

### 애니메이션 & 이펙트
- 게임 카드 호버: 네온 글로우 강화 + 약간의 확대
- 버튼 클릭: 눌림 효과 + 파티클
- 점수 업데이트: 카운터 애니메이션
- 게임 오버: 페이드 인/아웃
- 페이지 전환: 슬라이드 효과

## 🎮 게임 개발 가이드

### 게임 구현 원칙

1. **60 FPS 목표**
   - `requestAnimationFrame` 사용
   - 델타 타임 기반 업데이트
   - 최적화된 렌더링

2. **반응형 게임 화면**
   - 캔버스 크기 자동 조정
   - 모바일: 터치 조이스틱
   - 데스크톱: 키보드 입력

3. **간단한 조작**
   - 최소한의 버튼 (방향키 + 액션 1-2개)
   - 직관적인 UI
   - 튜토리얼 필요 없는 게임성

4. **로컬 데이터 저장**
   - 최고 점수 기록
   - 게임 설정 (사운드, 난이도)
   - 서버 통신 없음

### 게임 페이지 구조

```tsx
// app/games/snake/page.tsx
'use client';

import { GameCanvas } from '@/components/games/GameCanvas';
import { SnakeGame } from '@/lib/games/snake/SnakeGame';
import { ArcadeCard } from '@/components/ui/arcade/ArcadeCard';

export default function SnakePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-cyan-900">
      <div className="container mx-auto px-4 py-8">
        <ArcadeCard neonColor="green">
          <h1 className="pixel-text text-4xl mb-4">SNAKE</h1>
          <GameCanvas game={SnakeGame} />
          <div className="controls mt-4">
            <p>← → ↑ ↓ : 이동</p>
            <p>SPACE : 일시정지</p>
          </div>
        </ArcadeCard>
      </div>
    </div>
  );
}
```

## 🚀 배포 프로세스

### 로컬 개발
```bash
npm run dev        # 개발 서버 (http://localhost:3000)
npm run build      # 프로덕션 빌드
npm start          # 프로덕션 서버
npm run lint       # ESLint 실행
npm test           # 테스트 실행
```

### 자동 배포
1. `main` 브랜치에 push
2. Cloudflare Pages 자동 빌드
3. 2-3분 내 배포 완료
4. 프리뷰 URL 생성

### 배포 환경
- **Production**: `main` 브랜치 → 커스텀 도메인
- **Preview**: PR/브랜치 → `*.pages.dev`

## 📊 성능 목표

### 게임 성능
- **프레임레이트**: 60 FPS (고정)
- **입력 지연**: < 16ms
- **게임 로딩**: < 1s

### Core Web Vitals
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### 번들 사이즈
- Initial Load: < 100KB (gzipped)
- 게임별 청크: < 50KB
- Total Size: < 300KB

### Lighthouse 점수
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## 🔒 보안 & 프라이버시

- HTTPS 기본 적용 (Cloudflare SSL)
- **완전 클라이언트 사이드**: 모든 게임은 브라우저에서 실행
- 서버 데이터 전송 없음 (점수도 로컬 저장)
- No tracking/analytics (프라이버시 중심)
- 환경 변수 관리 (.env.local)
- 의존성 보안 업데이트 (Dependabot)

## 🎮 게임 목록 (계획)

| 게임 | 난이도 | 컨트롤 | 상태 |
|------|--------|--------|------|
| Snake | ⭐ | 방향키 | 계획 |
| Pong | ⭐ | ↑↓ | 계획 |
| Breakout | ⭐⭐ | ←→ | 계획 |
| Tetris | ⭐⭐⭐ | 방향키+Space | 계획 |
| Space Invaders | ⭐⭐⭐ | ←→+Space | 계획 |
| Pac-Man | ⭐⭐⭐⭐ | 방향키 | 계획 |
| Asteroids | ⭐⭐⭐⭐ | 방향키+Space | 계획 |

## 🤝 기여 가이드

### 개발 워크플로우
1. 기능별 브랜치 생성
2. 로컬에서 개발/테스트
3. PR 생성 → 프리뷰 확인
4. 리뷰 후 main 병합

### 커밋 컨벤션
```
feat: 새 게임 추가 (Snake 게임 구현)
fix: 게임 버그 수정
docs: 문서 수정
style: 코드 스타일 (포맷팅)
refactor: 리팩토링
test: 테스트 추가
chore: 빌드/설정 변경
```

### 새 게임 추가 시
1. `lib/games/[게임명]/` 폴더에 게임 로직 구현
2. `app/games/[게임명]/page.tsx` 페이지 생성
3. 게임 목록에 카드 추가
4. 테스트 플레이 (60 FPS 확인)
5. 최고 점수 저장 기능 구현
6. i18n 번역 추가

## 📚 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Canvas API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Game Loop Pattern](https://gameprogrammingpatterns.com/game-loop.html)
- [Cloudflare Pages 가이드](https://developers.cloudflare.com/pages/)

## 📞 문의

프로젝트 관련 문의나 제안은 GitHub Issues를 통해 부탁드립니다.

---

**마지막 업데이트**: 2025-10-06
**프로젝트 상태**: Phase 1 준비 중 (프로젝트 초기화)
