/**
 * Sound Library - 게임에서 사용할 사운드 정의
 *
 * 프로그래매틱하게 생성된 레트로 아케이드 사운드를 관리합니다.
 */

import { audioManager } from './AudioManager';
import { SoundGenerator } from './SoundGenerator';

/**
 * 사운드 키 정의
 */
export const SOUNDS = {
  // UI 사운드
  CLICK: 'click',
  BEEP: 'beep',
  SELECT: 'select',

  // 게임 공통 사운드
  JUMP: 'jump',
  COIN: 'coin',
  LASER: 'laser',
  EXPLOSION: 'explosion',
  POWER_UP: 'powerup',
  VICTORY: 'victory',
  GAME_OVER: 'gameover',

  // BGM
  BGM_MENU: 'bgm_menu',
  BGM_GAME: 'bgm_game',
} as const;

export type SoundKey = (typeof SOUNDS)[keyof typeof SOUNDS];

/**
 * 모든 사운드를 AudioManager에 로드
 */
export async function loadAllSounds(): Promise<void> {
  await audioManager.init();

  const context = (audioManager as any).audioContext;
  if (!context) {
    console.error('[Sounds] AudioContext not available');
    return;
  }

  const generator = new SoundGenerator(context);

  try {
    // 각 사운드 생성 및 로드
    const soundBuffers = {
      [SOUNDS.CLICK]: generator.generateClickSound(),
      [SOUNDS.BEEP]: generator.generateBeepSound(),
      [SOUNDS.SELECT]: generator.generateJumpSound(),
      [SOUNDS.JUMP]: generator.generateJumpSound(),
      [SOUNDS.COIN]: generator.generateCoinSound(),
      [SOUNDS.LASER]: generator.generateLaserSound(),
      [SOUNDS.EXPLOSION]: generator.generateExplosionSound(),
      [SOUNDS.POWER_UP]: generator.generatePowerUpSound(),
      [SOUNDS.VICTORY]: generator.generateVictorySound(),
      [SOUNDS.GAME_OVER]: generator.generateGameOverSound(),
      [SOUNDS.BGM_MENU]: generator.generateSimpleBGM(),
      [SOUNDS.BGM_GAME]: generator.generateSimpleBGM(),
    };

    // AudioManager에 등록
    for (const [key, buffer] of Object.entries(soundBuffers)) {
      (audioManager as any).audioBuffers.set(key, buffer);
    }

    console.log('[Sounds] All sounds loaded successfully');
  } catch (error) {
    console.error('[Sounds] Failed to load sounds:', error);
  }
}

/**
 * 사운드 재생 헬퍼 함수
 */
export function playSound(key: SoundKey): void {
  audioManager.playSfx(key);
}

/**
 * BGM 재생 헬퍼 함수
 */
export function playBGM(key: SoundKey): void {
  audioManager.playBgm(key, { loop: true, fadeIn: 1 });
}

/**
 * BGM 정지 헬퍼 함수
 */
export function stopBGM(): void {
  audioManager.stopBgm(1);
}

/**
 * 모든 사운드 정지
 */
export function stopAllSounds(): void {
  audioManager.stopAllSfx();
  audioManager.stopBgm();
}
