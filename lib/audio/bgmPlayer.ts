/**
 * BGM Player - 외부 BGM 파일 재생 관리
 *
 * HTML5 Audio를 사용하여 외부 BGM 파일을 재생합니다.
 * AudioManager와 별도로 동작하며, 더 간단한 BGM 재생을 제공합니다.
 */

import { loadAudioSettings } from '../storage/audioSettings';
import { selectRandomBGM, type BGMTrack } from './bgmTracks';

class BGMPlayer {
  private audio: HTMLAudioElement | null = null;
  private currentTrack: BGMTrack | null = null;
  private currentGameId: string | null = null;

  /**
   * 게임의 BGM 재생
   */
  play(gameId: string): void {
    const settings = loadAudioSettings();

    // BGM이 비활성화되어 있으면 재생하지 않음
    if (!settings.bgmEnabled) {
      return;
    }

    // 이미 같은 게임의 BGM이 재생 중이면 스킵
    if (this.currentGameId === gameId && this.audio && !this.audio.paused) {
      return;
    }

    // 이전 BGM 정지
    this.stop();

    // 랜덤 BGM 선택
    const track = selectRandomBGM(gameId);
    this.currentTrack = track;
    this.currentGameId = gameId;

    // Audio 엘리먼트 생성
    this.audio = new Audio(track.path);
    this.audio.loop = true;
    this.audio.volume = settings.masterVolume * settings.bgmVolume;

    // 재생
    this.audio.play().catch(err => {
      console.error('[BGMPlayer] Failed to play BGM:', err);
    });

    console.log(`[BGMPlayer] Playing: ${track.title} (${gameId})`);
  }

  /**
   * BGM 정지
   */
  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    this.currentTrack = null;
    this.currentGameId = null;
  }

  /**
   * BGM 일시정지
   */
  pause(): void {
    if (this.audio) {
      this.audio.pause();
    }
  }

  /**
   * BGM 재개
   */
  resume(): void {
    if (this.audio && this.audio.paused) {
      const settings = loadAudioSettings();
      if (settings.bgmEnabled) {
        this.audio.play().catch(err => {
          console.error('[BGMPlayer] Failed to resume BGM:', err);
        });
      }
    }
  }

  /**
   * 볼륨 업데이트
   */
  updateVolume(masterVolume: number, bgmVolume: number): void {
    if (this.audio) {
      this.audio.volume = masterVolume * bgmVolume;
    }
  }

  /**
   * 현재 재생 중인 트랙 정보
   */
  getCurrentTrack(): BGMTrack | null {
    return this.currentTrack;
  }

  /**
   * 재생 중인지 확인
   */
  isPlaying(): boolean {
    return this.audio !== null && !this.audio.paused;
  }
}

// 싱글톤 인스턴스
export const bgmPlayer = new BGMPlayer();

/**
 * 게임 페이지에서 사용할 헬퍼 함수
 */
export function playGameBGM(gameId: string): void {
  bgmPlayer.play(gameId);
}

export function stopGameBGM(): void {
  bgmPlayer.stop();
}

export function pauseGameBGM(): void {
  bgmPlayer.pause();
}

export function resumeGameBGM(): void {
  bgmPlayer.resume();
}
