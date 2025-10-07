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
│   │   ├── neon-serpent/      # 네온 서펀트 (추적형 필드)
│   │   ├── cascade-blocks/    # 캐스케이드 블록 (가변 필드)
│   │   ├── prism-smash/       # 프리즘 스매시 (벽 구조 퍼즐)
│   │   ├── spectral-pursuit/  # 스펙트럴 퍼슈트 (개방형 라비린스)
│   │   ├── pulse-paddles/     # 펄스 패들 (에너지 듀얼)
│   │   └── photon-vanguard/   # 포톤 뱅가드 (궤도 방어)
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
│   │   ├── neon-serpent/     # 네온 서펀트 로직
│   │   ├── cascade-blocks/   # 캐스케이드 블록 로직
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

### Phase 1: 기본 구조 ✅
- [x] Next.js 프로젝트 초기 설정 [#1](https://github.com/devlikebear/gamehub/issues/1) ✅
- [x] Tailwind CSS 설정 (네온 컬러 팔레트) [#2](https://github.com/devlikebear/gamehub/issues/2) ✅
- [x] 아케이드 테마 랜딩 페이지 구현 [#3](https://github.com/devlikebear/gamehub/issues/3) ✅
- [x] Git 저장소 초기화 [#4](https://github.com/devlikebear/gamehub/issues/4) ✅
- [ ] 배포 가이드 작성 [#5](https://github.com/devlikebear/gamehub/issues/5) 🚧

### Phase 2: 핵심 페이지 🚧

- [x] Navigation Bar 컴포넌트 (네온 스타일) [#6](https://github.com/devlikebear/gamehub/issues/6) ✅
- [x] Footer 컴포넌트 [#7](https://github.com/devlikebear/gamehub/issues/7) ✅
- [ ] About (소개) 페이지 [#8](https://github.com/devlikebear/gamehub/issues/8)
- [ ] Games 목록 페이지 (아케이드 캐비닛 스타일) [#9](https://github.com/devlikebear/gamehub/issues/9)
- [ ] Contact (연락처) 페이지 [#10](https://github.com/devlikebear/gamehub/issues/10)

### Phase 3: 공통 게임 엔진 구현 🚧

- [ ] 게임 루프 엔진 (requestAnimationFrame) [#11](https://github.com/devlikebear/gamehub/issues/11)
- [ ] 입력 핸들러 (키보드 + 터치) [#12](https://github.com/devlikebear/gamehub/issues/12)
- [ ] 충돌 감지 시스템 [#13](https://github.com/devlikebear/gamehub/issues/13)
- [ ] 점수 시스템 [#14](https://github.com/devlikebear/gamehub/issues/14)
- [ ] 로컬 스토리지 관리 (최고 점수) [#15](https://github.com/devlikebear/gamehub/issues/15)
- [ ] 게임 공통 UI (일시정지, 게임오버, 재시작) [#16](https://github.com/devlikebear/gamehub/issues/16)

## 🛡️ IP 컴플라이언스 전략

- **Pac-Man 계열 (고위험)**: 고정 미로, 노란 주인공, 4색 유령, 효과음을 사용하지 않는다. Spectral Pursuit는 개방형 지도를 기반으로 하고, 캐릭터 형태와 연출을 완전히 새롭게 디자인한다.
- **Space Invaders 계열 (고위험)**: 대형 편대, 보호막, 상단 UFO 연출을 차용하지 않는다. Photon Vanguard는 방사형 궤도 진입 시스템과 시간 왜곡 능력을 중심으로 제작한다.
- **Tetris 계열 (매우 고위험)**: 10×20 보드, 7 테트로미노, 고정 색 팔레트를 사용하지 않는다. Cascade Blocks는 가변 필드와 다각형 모듈, 에너지 루프 규칙을 사용한다.
- **Asteroids 계열 (중고위험)**: 벡터 우주선, 파편화 연출, 명칭을 그대로 쓰지 않는다. Starshard Drift는 네온 파티클과 중력 파동을 활용한다.
- **Breakout/Pong 계열 (중간)**: 명칭과 UI를 재창조하고, 물리 시스템과 필드 구성을 변형한다. Pulse Paddles와 Prism Smash는 네온 커브샷, 필드 재구성 등 신규 요소를 강조한다.
- **Snake 계열 (낮음)**: 기본 장르는 허용되지만 Nokia 스타일, 원본 UI를 사용하지 않는다. Neon Serpent는 절차적 필드와 에너지 과부하 메커닉을 사용한다.
- **자체 에셋 제작**: 그래픽·사운드·폰트를 직접 제작하거나 CC0/CC-BY 등 배포 허용 라이선스만 사용하며 출처를 명시한다.
- **브랜딩/README 정책**: 상표권이 있는 명칭은 마케팅 타이틀에 포함하지 않고, README에는 독립 프로젝트임을 명시하며 필요한 경우 최소한의 설명적 언급만 한다.

### Phase 4: 클래식 게임 구현

#### 우선순위 높음 (간단한 게임)

- [x] **Neon Serpent (네온 서펀트)** [#17](https://github.com/devlikebear/gamehub/issues/17): 절차적 필드 추적 게임
  - 캔버스 엔진 기반 60 FPS 프로토타입 구현 (대시/과부하/위험 구역)
  - 에너지 게이지, 콤보, 필드 재구성 및 EMP 슬로우 메커닉 지원
  - 게임 페이지 `/games/neon-serpent` 오픈 및 컨트롤 가이드 반영
  - 난이도: ⭐

- [x] **Pulse Paddles (펄스 패들)** [#18](https://github.com/devlikebear/gamehub/issues/18): 네온 커브샷 듀얼
  - 캔버스 프로토타입 구현 (곡선 궤적, 펄스 존, 7점 매치)
  - AI 적응 난이도 및 로컬 2P 토글(1/2 키) 지원
  - `/games/pulse-paddles` 페이지와 컨트롤 안내 추가
  - 득점 시 필드 패턴 재구성(듀얼 펄스/브레이크 라이너 등)
  - 난이도: ⭐

- [ ] **Prism Smash (프리즘 스매시)** [#19](https://github.com/devlikebear/gamehub/issues/19): 모듈형 벽체 해체 게임
  - 좌/우 키 + 필드 스왑 액션으로 패턴 변환
  - 다각형 블록이 충돌 시 조각으로 분리되어 콤보 생성
  - 난이도: ⭐⭐

#### 우선순위 중간

- [ ] **Cascade Blocks (캐스케이드 블록)** [#20](https://github.com/devlikebear/gamehub/issues/20): 다각형 낙하 퍼즐
  - 방향키로 다각형 모듈 회전/이동, Space 가속 낙하
  - 필드 크기가 라운드마다 변하며 목표도 동적으로 변경
  - 라인 대신 에너지 루프를 완성하면 점수 획득
  - 난이도: ⭐⭐⭐

- [ ] **Photon Vanguard (포톤 뱅가드)** [#21](https://github.com/devlikebear/gamehub/issues/21): 방사형 궤도 방어 슈팅
  - 좌/우 이동 및 타임 슬로우/파동 발사 시스템
  - 편대 대신 동심원 궤도로 진입하는 포톤 구체 대응
  - 보호막 대신 가변 타임라인 실드 구현
  - 난이도: ⭐⭐⭐

#### 우선순위 낮음 (복잡한 게임)

- [ ] **Spectral Pursuit (스펙트럴 퍼슈트)** [#22](https://github.com/devlikebear/gamehub/issues/22): 스텔스 라비린스 체이스
  - 방향키 이동 + 위장 능력으로 추적자 AI 회피
  - 고정 미로 대신 오픈 라우팅 레이어, 수집 목표는 빛의 파편
  - 긴장도 시스템(시야/사운드 노출)
  - 난이도: ⭐⭐⭐⭐

- [ ] **Starshard Drift (스타샤드 드리프트)** [#23](https://github.com/devlikebear/gamehub/issues/23): 중력 파편 드리프트 슈팅
  - 회전/추진/펄스 방출로 파편 조각 관리
  - 벡터 대신 네온 파티클 아트, 파편은 중력장에 따라 분기
  - 스테이지마다 중력 파동 패턴이 변화
  - 난이도: ⭐⭐⭐⭐

### Phase 5: 리더보드 & 소셜 기능

- [ ] 리더보드 페이지 [#24](https://github.com/devlikebear/gamehub/issues/24)
- [ ] 로컬 최고 점수 기록 (게임별)
- [ ] 점수 공유 기능 (SNS)
- [ ] 친구 초대 기능

### Phase 6: 개선 & 최적화

- [ ] SEO 최적화 (메타 태그, sitemap) [#25](https://github.com/devlikebear/gamehub/issues/25)
- [ ] 게임 효과음 & BGM [#26](https://github.com/devlikebear/gamehub/issues/26)
- [ ] PWA 지원 (오프라인 플레이) [#27](https://github.com/devlikebear/gamehub/issues/27)
- [ ] Open Graph 이미지 (게임별)
- [ ] 다국어 지원 (한국어/영어)
- [ ] 다크모드 토글 (기본: 다크)
- [ ] 애니메이션 효과 (CRT 스캔라인, 글로우)
- [ ] 성능 최적화 (Canvas, 코드 스플리팅)

### Phase 7: 추가 기능

- [ ] 업적 시스템 (뱃지/트로피) [#28](https://github.com/devlikebear/gamehub/issues/28)
- [ ] 게임 통계 (플레이 시간, 플레이 횟수)
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
// app/games/neon-serpent/page.tsx
'use client';

import { GameCanvas } from '@/components/games/GameCanvas';
import { NeonSerpentGame } from '@/lib/games/neon-serpent/NeonSerpentGame';
import { ArcadeCard } from '@/components/ui/arcade/ArcadeCard';

export default function NeonSerpentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-cyan-900">
      <div className="container mx-auto px-4 py-8">
        <ArcadeCard neonColor="green">
          <h1 className="pixel-text text-4xl mb-4">NEON SERPENT</h1>
          <GameCanvas game={NeonSerpentGame} />
          <div className="controls mt-4">
            <p>← → ↑ ↓ : 이동</p>
            <p>Shift : 대시 / SPACE : 일시정지</p>
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
| Neon Serpent | ⭐ | 방향키 + 대시 | 플레이 가능 |
| Pulse Paddles | ⭐ | ↑↓ + 커브샷 | 플레이 가능 |
| Prism Smash | ⭐⭐ | ←→ + 필드 스왑 | 계획 |
| Cascade Blocks | ⭐⭐⭐ | 방향키 + Space | 계획 |
| Photon Vanguard | ⭐⭐⭐ | ←→ + 파동 | 계획 |
| Spectral Pursuit | ⭐⭐⭐⭐ | 방향키 + 위장 | 계획 |
| Starshard Drift | ⭐⭐⭐⭐ | 방향키 + 펄스 | 계획 |

## 🤝 기여 가이드

### 개발 워크플로우
1. 기능별 브랜치 생성
2. 로컬에서 개발/테스트
3. PR 생성 → 프리뷰 확인
4. 리뷰 후 main 병합

### 커밋 컨벤션
```
feat: 새 게임 추가 (Neon Serpent 구현)
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
