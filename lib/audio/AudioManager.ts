/**
 * AudioManager - Web Audio API 기반 게임 사운드 매니저
 *
 * 주요 기능:
 * - 효과음(SFX) 재생 및 관리
 * - 배경음악(BGM) 재생 및 루프
 * - 개별 볼륨 조절 (마스터, BGM, SFX)
 * - 음소거(Mute) 기능
 */

export type SoundType = 'bgm' | 'sfx';

export interface AudioSettings {
  masterVolume: number; // 0.0 ~ 1.0
  bgmVolume: number;    // 0.0 ~ 1.0
  sfxVolume: number;    // 0.0 ~ 1.0
  bgmEnabled: boolean;
  sfxEnabled: boolean;
}

class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // 로드된 오디오 버퍼 캐시
  private audioBuffers: Map<string, AudioBuffer> = new Map();

  // 현재 재생 중인 사운드
  private activeSources: Map<string, AudioBufferSourceNode> = new Map();

  // 현재 재생 중인 BGM
  private currentBgm: AudioBufferSourceNode | null = null;
  private currentBgmKey: string | null = null;

  // 설정
  private settings: AudioSettings = {
    masterVolume: 0.7,
    bgmVolume: 0.5,
    sfxVolume: 0.7,
    bgmEnabled: true,
    sfxEnabled: true,
  };

  private initialized = false;

  /**
   * 오디오 시스템 초기화
   * 사용자 인터랙션 이후 호출되어야 함 (브라우저 autoplay 정책)
   */
  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      // AudioContext 생성 (Safari 호환성 고려)
      const AudioContextClass = window.AudioContext || (window as typeof AudioContext & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error('AudioContext not supported');
      }
      this.audioContext = new AudioContextClass();

      // Gain 노드 생성 (볼륨 조절용)
      this.masterGain = this.audioContext.createGain();
      this.bgmGain = this.audioContext.createGain();
      this.sfxGain = this.audioContext.createGain();

      // 오디오 그래프 연결: Source → Type Gain → Master Gain → Destination
      this.bgmGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.audioContext.destination);

      // 초기 볼륨 설정
      this.updateVolumes();

      this.initialized = true;
      console.log('[AudioManager] Initialized successfully');
    } catch (error) {
      console.error('[AudioManager] Failed to initialize:', error);
    }
  }

  /**
   * 오디오 파일 로드 및 캐싱
   */
  async loadSound(key: string, url: string): Promise<void> {
    if (!this.audioContext) {
      console.warn('[AudioManager] Not initialized. Call init() first.');
      return;
    }

    if (this.audioBuffers.has(key)) {
      console.log(`[AudioManager] Sound "${key}" already loaded`);
      return;
    }

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      this.audioBuffers.set(key, audioBuffer);
      console.log(`[AudioManager] Loaded sound: ${key}`);
    } catch (error) {
      console.error(`[AudioManager] Failed to load sound "${key}":`, error);
    }
  }

  /**
   * 여러 오디오 파일 일괄 로드
   */
  async loadSounds(sounds: Array<{ key: string; url: string }>): Promise<void> {
    await Promise.all(sounds.map(({ key, url }) => this.loadSound(key, url)));
  }

  /**
   * 효과음 재생
   */
  playSfx(key: string, options: { loop?: boolean; volume?: number } = {}): void {
    if (!this.settings.sfxEnabled || !this.audioContext || !this.sfxGain) {
      return;
    }

    const buffer = this.audioBuffers.get(key);
    if (!buffer) {
      console.warn(`[AudioManager] Sound "${key}" not loaded`);
      return;
    }

    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.loop = options.loop ?? false;

      // 개별 볼륨 조절이 필요한 경우
      if (options.volume !== undefined) {
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = options.volume;
        source.connect(gainNode);
        gainNode.connect(this.sfxGain);
      } else {
        source.connect(this.sfxGain);
      }

      source.start(0);

      // 루프가 아니면 재생 완료 후 정리
      if (!options.loop) {
        source.onended = () => {
          this.activeSources.delete(key);
        };
      }

      this.activeSources.set(key, source);
    } catch (error) {
      console.error(`[AudioManager] Failed to play SFX "${key}":`, error);
    }
  }

  /**
   * BGM 재생 (이전 BGM은 자동으로 정지)
   */
  playBgm(key: string, options: { loop?: boolean; fadeIn?: number } = {}): void {
    if (!this.settings.bgmEnabled || !this.audioContext || !this.bgmGain) {
      return;
    }

    // 이미 재생 중인 BGM이 같으면 무시
    if (this.currentBgmKey === key && this.currentBgm) {
      return;
    }

    // 이전 BGM 정지
    this.stopBgm();

    const buffer = this.audioBuffers.get(key);
    if (!buffer) {
      console.warn(`[AudioManager] BGM "${key}" not loaded`);
      return;
    }

    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.loop = options.loop ?? true; // BGM은 기본적으로 루프

      // 페이드 인 효과
      if (options.fadeIn && options.fadeIn > 0) {
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = 0;
        gainNode.gain.linearRampToValueAtTime(
          1,
          this.audioContext.currentTime + options.fadeIn
        );
        source.connect(gainNode);
        gainNode.connect(this.bgmGain);
      } else {
        source.connect(this.bgmGain);
      }

      source.start(0);

      this.currentBgm = source;
      this.currentBgmKey = key;

      console.log(`[AudioManager] Playing BGM: ${key}`);
    } catch (error) {
      console.error(`[AudioManager] Failed to play BGM "${key}":`, error);
    }
  }

  /**
   * BGM 정지
   */
  stopBgm(fadeOut?: number): void {
    if (!this.currentBgm || !this.audioContext) return;

    try {
      if (fadeOut && fadeOut > 0 && this.bgmGain) {
        // 페이드 아웃
        this.bgmGain.gain.linearRampToValueAtTime(
          0,
          this.audioContext.currentTime + fadeOut
        );
        setTimeout(() => {
          this.currentBgm?.stop();
          this.currentBgm = null;
          this.currentBgmKey = null;
          if (this.bgmGain) {
            this.bgmGain.gain.value = this.settings.bgmVolume;
          }
        }, fadeOut * 1000);
      } else {
        this.currentBgm.stop();
        this.currentBgm = null;
        this.currentBgmKey = null;
      }
    } catch (error) {
      console.error('[AudioManager] Failed to stop BGM:', error);
    }
  }

  /**
   * 특정 효과음 정지
   */
  stopSfx(key: string): void {
    const source = this.activeSources.get(key);
    if (source) {
      try {
        source.stop();
        this.activeSources.delete(key);
      } catch (error) {
        console.error(`[AudioManager] Failed to stop SFX "${key}":`, error);
      }
    }
  }

  /**
   * 모든 효과음 정지
   */
  stopAllSfx(): void {
    this.activeSources.forEach((source, key) => {
      try {
        source.stop();
      } catch (error) {
        console.error(`[AudioManager] Failed to stop SFX "${key}":`, error);
      }
    });
    this.activeSources.clear();
  }

  /**
   * 설정 업데이트
   */
  updateSettings(newSettings: Partial<AudioSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.updateVolumes();

    // BGM/SFX 활성화 상태 변경 시 처리
    if (newSettings.bgmEnabled === false) {
      this.stopBgm();
    }
    if (newSettings.sfxEnabled === false) {
      this.stopAllSfx();
    }
  }

  /**
   * 현재 설정 가져오기
   */
  getSettings(): AudioSettings {
    return { ...this.settings };
  }

  /**
   * 볼륨 노드 업데이트
   */
  private updateVolumes(): void {
    if (!this.masterGain || !this.bgmGain || !this.sfxGain) return;

    this.masterGain.gain.value = this.settings.masterVolume;
    this.bgmGain.gain.value = this.settings.bgmEnabled ? this.settings.bgmVolume : 0;
    this.sfxGain.gain.value = this.settings.sfxEnabled ? this.settings.sfxVolume : 0;
  }

  /**
   * 전체 정리 (페이지 이탈 시)
   */
  cleanup(): void {
    this.stopBgm();
    this.stopAllSfx();

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.audioBuffers.clear();
    this.initialized = false;
    console.log('[AudioManager] Cleaned up');
  }

  /**
   * AudioContext 가져오기 (사운드 생성용)
   */
  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  /**
   * 사운드 버퍼 등록 (프로그래밍 방식 생성)
   */
  registerSound(key: string, buffer: AudioBuffer): void {
    this.audioBuffers.set(key, buffer);
  }
}

// 싱글톤 인스턴스
export const audioManager = new AudioManager();
