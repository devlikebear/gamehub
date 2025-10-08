/**
 * In-Memory Rate Limiter
 * 동일 IP에서 짧은 시간에 여러 점수를 제출하는 것을 방지
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate Limit 설정
 */
export const RATE_LIMIT_CONFIG = {
  windowMs: 60000, // 1분
  maxRequests: 5, // 1분에 최대 5회 요청
};

/**
 * IP 주소에 대한 rate limit 체크
 * @returns true if allowed, false if rate limited
 */
export function checkRateLimit(ip: string, gameId: string): boolean {
  const key = `${ip}:${gameId}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    // 새로운 윈도우 시작
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_CONFIG.windowMs,
    });
    return true;
  }

  if (entry.count >= RATE_LIMIT_CONFIG.maxRequests) {
    // Rate limit 초과
    return false;
  }

  // 카운트 증가
  entry.count += 1;
  return true;
}

/**
 * Rate limit 초기화 (테스트용)
 */
export function resetRateLimit(ip: string, gameId: string): void {
  const key = `${ip}:${gameId}`;
  rateLimitStore.delete(key);
}

/**
 * 만료된 엔트리 정리 (메모리 관리)
 * 주기적으로 호출해야 함
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

// 5분마다 자동 정리
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}
