# Leaderboard Security

리더보드 시스템에 적용된 보안 기능입니다.

## 🔒 적용된 보안 기능

### 1. Origin/Referer 검증
외부 사이트에서 API를 호출하는 것을 차단합니다.

```typescript
// 허용된 Origin만 요청 가능
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL,
  'http://localhost:3000',
];
```

### 2. 점수 범위 검증
게임별로 최대 점수를 설정하여 비정상적인 점수를 차단합니다.

```typescript
// lib/leaderboard/validation.ts
export const GAME_LIMITS: Record<string, GameLimits> = {
  'stellar-salvo': {
    maxScore: 1000000,
    minPlayTime: 10000, // 10초
  },
  // ...
};
```

**게임별 제한:**
- Stellar Salvo: 최대 1,000,000점
- Photon Vanguard: 최대 500,000점
- Spectral Pursuit: 최대 50,000점
- Starshard Drift: 최대 100,000점
- Color Match Cascade: 최대 500,000점
- Neon Serpent: 최대 200,000점
- Pulse Paddles: 최대 70점 (승점 기반)
- Prism Smash: 최대 300,000점

### 3. Rate Limiting
동일 IP에서 짧은 시간에 여러 점수를 제출하는 것을 방지합니다.

```typescript
// 1분에 최대 5회 요청
const RATE_LIMIT_CONFIG = {
  windowMs: 60000, // 1분
  maxRequests: 5,
};
```

**Rate Limit 초과 시:**
- HTTP 429 (Too Many Requests) 응답
- 1분 후 자동 초기화

## 📊 보안 로그

보안 이벤트는 서버 콘솔에 로깅됩니다:

```typescript
// Origin 차단
console.warn(`Blocked request from unauthorized origin: ${origin}`);

// 점수 범위 초과
console.warn(`Invalid score ${score} for game ${gameId}`);

// Rate limit 초과
console.warn(`Rate limit exceeded for IP ${ip} on game ${gameId}`);
```

## 🚀 향후 개선 가능 사항

### 중기 (보통 난이도)
- [ ] 게임 세션 토큰 시스템
- [ ] 플레이 시간 검증 (너무 빠른 클리어 차단)
- [ ] Redis/Vercel KV 기반 분산 Rate Limiting

### 장기 (높은 난이도)
- [ ] Cloudflare Turnstile (CAPTCHA 대안)
- [ ] 서버 사이드 게임 리플레이 검증
- [ ] 의심스러운 패턴 감지 (ML 기반)

## 🔧 설정

`.env` 파일에 사이트 URL을 설정하세요:

```bash
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

## 📝 참고사항

- Origin 검증은 브라우저 환경에서만 동작합니다.
- 개발 환경에서는 `localhost:3000` 자동 허용됩니다.
- Rate Limiter는 인메모리 저장소를 사용하여 서버 재시작 시 초기화됩니다.
