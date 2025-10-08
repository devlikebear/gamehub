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
    const bpm = 150; // 빠른 템포
    const beatDuration = 60 / bpm; // 0.4초
    const duration = beatDuration * 16; // 16박자 = 6.4초 루프
    const length = sampleRate * duration;
    const buffer = this.audioContext!.createBuffer(2, length, sampleRate);
    const dataL = buffer.getChannelData(0);
    const dataR = buffer.getChannelData(1);

    // SF 느낌의 신스 멜로디 (옥타브 점프, 8분음표)
    const melody = [
      { freq: 440, start: 0, duration: beatDuration },           // A4
      { freq: 880, start: beatDuration, duration: beatDuration },     // A5
      { freq: 659.25, start: beatDuration * 2, duration: beatDuration }, // E5
      { freq: 1318.5, start: beatDuration * 3, duration: beatDuration }, // E6
      { freq: 523.25, start: beatDuration * 4, duration: beatDuration }, // C5
      { freq: 1046.5, start: beatDuration * 5, duration: beatDuration }, // C6
      { freq: 587.33, start: beatDuration * 6, duration: beatDuration }, // D5
      { freq: 1174.7, start: beatDuration * 7, duration: beatDuration }, // D6
      { freq: 440, start: beatDuration * 8, duration: beatDuration },     // A4
      { freq: 880, start: beatDuration * 9, duration: beatDuration },     // A5
      { freq: 739.99, start: beatDuration * 10, duration: beatDuration }, // F#5
      { freq: 1480, start: beatDuration * 11, duration: beatDuration },   // F#6
      { freq: 493.88, start: beatDuration * 12, duration: beatDuration }, // B4
      { freq: 987.77, start: beatDuration * 13, duration: beatDuration }, // B5
      { freq: 659.25, start: beatDuration * 14, duration: beatDuration }, // E5
      { freq: 1318.5, start: beatDuration * 15, duration: beatDuration }, // E6
    ];

    // 베이스 라인 (2박마다)
    const bassline = [
      { freq: 110, start: 0, duration: beatDuration * 4 },       // A2
      { freq: 130.81, start: beatDuration * 4, duration: beatDuration * 4 }, // C3
      { freq: 110, start: beatDuration * 8, duration: beatDuration * 4 },    // A2
      { freq: 123.47, start: beatDuration * 12, duration: beatDuration * 4 }, // B2
    ];

    // SF 신스 멜로디 생성 (우측 채널 - 톱니파 + 비브라토)
    for (const note of melody) {
      const startSample = Math.floor(note.start * sampleRate);
      const endSample = Math.floor((note.start + note.duration) * sampleRate);

      for (let i = startSample; i < endSample && i < length; i++) {
        const t = (i - startSample) / sampleRate;
        const envelope = t < 0.02 ? t / 0.02 : Math.max(0, 1 - (t - 0.02) / (note.duration - 0.02));

        // 비브라토 효과 (SF 느낌)
        const vibrato = 1 + Math.sin(2 * Math.PI * 5 * t) * 0.003;

        // 톱니파 (sawtooth) - 더 밝고 SF적인 소리
        const phase = (2 * Math.PI * note.freq * vibrato * t) % (2 * Math.PI);
        const sawtooth = (phase / Math.PI - 1) * 0.08;

        dataR[i] += sawtooth * envelope;
      }
    }

    // 베이스 라인 생성 (좌측 채널)
    for (const bass of bassline) {
      const startSample = Math.floor(bass.start * sampleRate);
      const endSample = Math.floor((bass.start + bass.duration) * sampleRate);

      for (let i = startSample; i < endSample && i < length; i++) {
        const t = (i - startSample) / sampleRate;
        // 펄스파 베이스
        const pulse = Math.sign(Math.sin(2 * Math.PI * bass.freq * t)) * 0.2;
        dataL[i] += pulse;
      }
    }

    // 드럼 패턴 (양쪽 채널)
    for (let beat = 0; beat < 16; beat++) {
      const beatTime = beat * beatDuration;

      // 킥 드럼 (1, 5, 9, 13박)
      if (beat % 4 === 0) {
        const startSample = Math.floor(beatTime * sampleRate);
        const kickLength = Math.floor(0.1 * sampleRate);

        for (let i = 0; i < kickLength && (startSample + i) < length; i++) {
          const t = i / sampleRate;
          const freq = 80 * Math.exp(-t * 50); // 피치 하강
          const envelope = Math.exp(-t * 20);
          const kick = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;
          dataL[startSample + i] += kick;
          dataR[startSample + i] += kick;
        }
      }

      // 스네어 (3, 7, 11, 15박)
      if (beat % 4 === 2) {
        const startSample = Math.floor(beatTime * sampleRate);
        const snareLength = Math.floor(0.08 * sampleRate);

        for (let i = 0; i < snareLength && (startSample + i) < length; i++) {
          const t = i / sampleRate;
          const envelope = Math.exp(-t * 25);
          const noise = (Math.random() * 2 - 1) * envelope * 0.15;
          dataL[startSample + i] += noise;
          dataR[startSample + i] += noise;
        }
      }

      // 하이햇 (매 8분음표)
      if (beat % 2 === 1) {
        const startSample = Math.floor(beatTime * sampleRate);
        const hihatLength = Math.floor(0.03 * sampleRate);

        for (let i = 0; i < hihatLength && (startSample + i) < length; i++) {
          const t = i / sampleRate;
          const envelope = Math.exp(-t * 50);
          const hihat = (Math.random() * 2 - 1) * envelope * 0.08;
          dataL[startSample + i] += hihat;
          dataR[startSample + i] += hihat;
        }
      }
    }

    return buffer;
  }
}
