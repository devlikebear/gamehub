/**
 * Share Message Templates
 *
 * SNS 공유를 위한 메시지 템플릿
 */

export interface ShareData {
  gameId: string;
  gameName: string;
  gameNameEn: string;
  score: number;
  achievements?: string[];
  url: string;
}

/**
 * 공유 메시지 생성 (한국어)
 */
export function createShareMessageKo(data: ShareData): string {
  const { gameName, score, achievements } = data;

  let message = `🎮 GameHub에서 ${gameName} ${score.toLocaleString()}점 달성!\n`;

  if (achievements && achievements.length > 0) {
    message += `🏆 업적: ${achievements.join(', ')}\n`;
  }

  message += `\n지금 플레이해보세요! 👉 ${data.url}`;

  return message;
}

/**
 * 공유 메시지 생성 (영어)
 */
export function createShareMessageEn(data: ShareData): string {
  const { gameNameEn, score, achievements } = data;

  let message = `🎮 Scored ${score.toLocaleString()} in ${gameNameEn} on GameHub!\n`;

  if (achievements && achievements.length > 0) {
    message += `🏆 Achievements: ${achievements.join(', ')}\n`;
  }

  message += `\nPlay now! 👉 ${data.url}`;

  return message;
}

/**
 * 공유 제목 생성 (한국어)
 */
export function createShareTitleKo(data: ShareData): string {
  return `GameHub - ${data.gameName} ${data.score.toLocaleString()}점 달성!`;
}

/**
 * 공유 제목 생성 (영어)
 */
export function createShareTitleEn(data: ShareData): string {
  return `GameHub - Scored ${data.score.toLocaleString()} in ${data.gameNameEn}!`;
}

/**
 * 해시태그 생성
 */
export function createHashtags(gameId: string): string[] {
  return ['GameHub', 'RetroGaming', gameId];
}
