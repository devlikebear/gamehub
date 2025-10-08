/**
 * Audio Settings Storage
 *
 * localStorage를 사용하여 오디오 설정을 저장/불러옵니다.
 */

import { AudioSettings } from '../audio/AudioManager';

const STORAGE_KEY = 'gamehub_audio_settings';

const DEFAULT_SETTINGS: AudioSettings = {
  masterVolume: 0.7,
  bgmVolume: 0.5,
  sfxVolume: 0.7,
  bgmEnabled: true,
  sfxEnabled: true,
};

/**
 * 오디오 설정 저장
 */
export function saveAudioSettings(settings: AudioSettings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('[AudioSettings] Failed to save:', error);
  }
}

/**
 * 오디오 설정 불러오기
 */
export function loadAudioSettings(): AudioSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(stored);

    // 유효성 검증
    return {
      masterVolume: clamp(parsed.masterVolume ?? 0.7, 0, 1),
      bgmVolume: clamp(parsed.bgmVolume ?? 0.5, 0, 1),
      sfxVolume: clamp(parsed.sfxVolume ?? 0.7, 0, 1),
      bgmEnabled: parsed.bgmEnabled ?? true,
      sfxEnabled: parsed.sfxEnabled ?? true,
    };
  } catch (error) {
    console.error('[AudioSettings] Failed to load:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * 오디오 설정 초기화
 */
export function resetAudioSettings(): AudioSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('[AudioSettings] Failed to reset:', error);
  }
  return DEFAULT_SETTINGS;
}

/**
 * 값을 최소/최대 범위로 제한
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
