/**
 * SoundGenerator - 프로그래매틱 사운드 생성
 *
 * Web Audio API를 사용하여 레트로 아케이드 스타일의 효과음을 실시간 생성합니다.
 * 별도의 오디오 파일 없이 순수 코드로 사운드를 만들어 저작권 이슈가 없고,
 * 파일 크기도 최소화할 수 있습니다.
 */

export class SoundGenerator {
  private audioContext: AudioContext | null = null;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  /**
   * 기본 톤 생성 (Oscillator 기반)
   */
  private createOscillator(
    frequency: number,
    type: OscillatorType = 'square',
    duration: number = 0.1
  ): AudioBufferSourceNode {
    if (!this.audioContext) {
      throw new Error('AudioContext not initialized');
    }

    const oscillator = this.audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.connect(gainNode);
    return oscillator as unknown as AudioBufferSourceNode;
  }

  /**
   * 점프/선택 사운드 (상승 톤)
   */
  generateJumpSound(): AudioBuffer {
    const sampleRate = this.audioContext!.sampleRate;
    const duration = 0.15;
    const length = sampleRate * duration;
    const buffer = this.audioContext!.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const freq = 300 + (t * 800); // 300Hz → 1100Hz
      const decay = Math.exp(-t * 10);
      data[i] = Math.sin(2 * Math.PI * freq * t) * decay * 0.3;
    }

    return buffer;
  }

  /**
   * 코인/포인트 사운드 (맑은 벨 톤)
   */
  generateCoinSound(): AudioBuffer {
    const sampleRate = this.audioContext!.sampleRate;
    const duration = 0.2;
    const length = sampleRate * duration;
    const buffer = this.audioContext!.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const decay = Math.exp(-t * 8);
      // 하모닉스 추가 (벨 사운드)
      const note1 = Math.sin(2 * Math.PI * 1000 * t);
      const note2 = Math.sin(2 * Math.PI * 1500 * t) * 0.5;
      data[i] = (note1 + note2) * decay * 0.25;
    }

    return buffer;
  }

  /**
   * 폭발/충돌 사운드 (화이트 노이즈 기반)
   */
  generateExplosionSound(): AudioBuffer {
    const sampleRate = this.audioContext!.sampleRate;
    const duration = 0.3;
    const length = sampleRate * duration;
    const buffer = this.audioContext!.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const decay = Math.exp(-t * 12);
      // 화이트 노이즈 + 저주파 럼블
      const noise = (Math.random() * 2 - 1) * 0.5;
      const rumble = Math.sin(2 * Math.PI * 60 * t) * 0.3;
      data[i] = (noise + rumble) * decay;
    }

    return buffer;
  }

  /**
   * 레이저/슈팅 사운드 (하강 톤)
   */
  generateLaserSound(): AudioBuffer {
    const sampleRate = this.audioContext!.sampleRate;
    const duration = 0.1;
    const length = sampleRate * duration;
    const buffer = this.audioContext!.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const freq = 1200 - (t * 1000); // 1200Hz → 200Hz
      const decay = Math.exp(-t * 15);
      data[i] = Math.sin(2 * Math.PI * freq * t) * decay * 0.2;
    }

    return buffer;
  }

  /**
   * 파워업/달성 사운드 (상승 코드)
   */
  generatePowerUpSound(): AudioBuffer {
    const sampleRate = this.audioContext!.sampleRate;
    const duration = 0.4;
    const length = sampleRate * duration;
    const buffer = this.audioContext!.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const noteIndex = Math.floor(t * 10) % notes.length;
      const freq = notes[noteIndex];
      const decay = Math.exp(-t * 3);
      data[i] = Math.sin(2 * Math.PI * freq * t) * decay * 0.2;
    }

    return buffer;
  }

  /**
   * 게임 오버 사운드 (하강 코드)
   */
  generateGameOverSound(): AudioBuffer {
    const sampleRate = this.audioContext!.sampleRate;
    const duration = 0.8;
    const length = sampleRate * duration;
    const buffer = this.audioContext!.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    const notes = [523.25, 392, 329.63, 261.63]; // C5, G4, E4, C4 (하강)

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const noteIndex = Math.floor(t * 4);
      if (noteIndex >= notes.length) continue;

      const freq = notes[noteIndex];
      const localT = t - (noteIndex * 0.2);
      const decay = Math.exp(-localT * 5);
      data[i] = Math.sin(2 * Math.PI * freq * localT) * decay * 0.25;
    }

    return buffer;
  }

  /**
   * 클릭/버튼 사운드
   */
  generateClickSound(): AudioBuffer {
    const sampleRate = this.audioContext!.sampleRate;
    const duration = 0.05;
    const length = sampleRate * duration;
    const buffer = this.audioContext!.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const decay = Math.exp(-t * 40);
      data[i] = Math.sin(2 * Math.PI * 800 * t) * decay * 0.3;
    }

    return buffer;
  }

  /**
   * 경고/오류 사운드 (비프음)
   */
  generateBeepSound(): AudioBuffer {
    const sampleRate = this.audioContext!.sampleRate;
    const duration = 0.15;
    const length = sampleRate * duration;
    const buffer = this.audioContext!.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = t < 0.05 ? 1 : Math.exp(-(t - 0.05) * 10);
      data[i] = Math.sin(2 * Math.PI * 440 * t) * envelope * 0.3;
    }

    return buffer;
  }

  /**
   * 승리/클리어 사운드
   */
  generateVictorySound(): AudioBuffer {
    const sampleRate = this.audioContext!.sampleRate;
    const duration = 1.0;
    const length = sampleRate * duration;
    const buffer = this.audioContext!.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    // 승리 멜로디: C-E-G-C (상승)
    const melody = [
      { freq: 523.25, start: 0, duration: 0.2 },    // C5
      { freq: 659.25, start: 0.2, duration: 0.2 },  // E5
      { freq: 783.99, start: 0.4, duration: 0.2 },  // G5
      { freq: 1046.5, start: 0.6, duration: 0.4 },  // C6 (길게)
    ];

    for (const note of melody) {
      const startSample = Math.floor(note.start * sampleRate);
      const endSample = Math.floor((note.start + note.duration) * sampleRate);

      for (let i = startSample; i < endSample && i < length; i++) {
        const t = (i - startSample) / sampleRate;
        const decay = Math.exp(-t * 5);
        data[i] += Math.sin(2 * Math.PI * note.freq * t) * decay * 0.2;
      }
    }

    return buffer;
  }

  /**
   * 간단한 BGM 루프 생성 (레트로 스타일)
   */
  generateSimpleBGM(): AudioBuffer {
    const sampleRate = this.audioContext!.sampleRate;
    const duration = 8.0; // 8초 루프
    const length = sampleRate * duration;
    const buffer = this.audioContext!.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    // 간단한 베이스 라인 (C-G-Am-F 코드)
    const bassline = [
      { freq: 130.81, start: 0, duration: 2 },    // C3
      { freq: 196.00, start: 2, duration: 2 },    // G3
      { freq: 220.00, start: 4, duration: 2 },    // A3
      { freq: 174.61, start: 6, duration: 2 },    // F3
    ];

    for (const note of bassline) {
      const startSample = Math.floor(note.start * sampleRate);
      const endSample = Math.floor((note.start + note.duration) * sampleRate);

      for (let i = startSample; i < endSample && i < length; i++) {
        const t = (i - startSample) / sampleRate;
        // 베이스: 사각파 + 감쇠
        const bass = Math.sign(Math.sin(2 * Math.PI * note.freq * t)) * 0.15;
        data[i] += bass;

        // 하이햇 리듬 (매 0.25초마다)
        if (Math.floor(t * 4) !== Math.floor((t - 1/sampleRate) * 4)) {
          const hihat = (Math.random() * 2 - 1) * 0.05;
          data[i] += hihat;
        }
      }
    }

    return buffer;
  }
}
