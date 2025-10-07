type KeyCode = string;

interface InputBufferEntry {
  key: KeyCode;
  time: number;
}

interface JoystickState {
  active: boolean;
  x: number;
  y: number;
  angle: number;
  intensity: number;
}

interface InputHandlerOptions {
  bufferSize?: number;
  bufferDuration?: number;
  preventDefault?: boolean;
  targetElement?: HTMLElement | null;
}

const DEFAULT_OPTIONS: Required<InputHandlerOptions> = {
  bufferSize: 16,
  bufferDuration: 180,
  preventDefault: true,
  targetElement: null,
};

/**
 * 키보드/터치 입력을 통합 관리하는 핸들러.
 * - 키 입력 상태 조회
 * - 최근 입력 버퍼 (콤보/재시작 등)
 * - 모바일 가상 조이스틱 벡터 계산
 */
export class InputHandler {
  private readonly options: Required<InputHandlerOptions>;
  private readonly pressedKeys = new Set<KeyCode>();
  private readonly buffer: InputBufferEntry[] = [];
  private readonly listeners: Array<(keys: Set<KeyCode>) => void> = [];
  private readonly onKeyDown = (event: KeyboardEvent) => this.handleKeyDown(event);
  private readonly onKeyUp = (event: KeyboardEvent) => this.handleKeyUp(event);
  private readonly onTouchStart = (event: Event) => this.handleTouchStart(event);
  private readonly onTouchMove = (event: Event) => this.handleTouchMove(event);
  private readonly onTouchEnd = (_event: Event) => this.resetJoystick();

  private joystick: JoystickState = { active: false, x: 0, y: 0, angle: 0, intensity: 0 };
  private touchOrigin: { x: number; y: number } | null = null;
  private attached = false;

  constructor(options: InputHandlerOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  public attach(): void {
    if (this.attached) return;
    window.addEventListener('keydown', this.onKeyDown, { passive: !this.options.preventDefault });
    window.addEventListener('keyup', this.onKeyUp, { passive: true });

    const target = this.options.targetElement ?? window;
    target.addEventListener('touchstart', this.onTouchStart, { passive: true });
    target.addEventListener('touchmove', this.onTouchMove, { passive: true });
    target.addEventListener('touchend', this.onTouchEnd, { passive: true });
    target.addEventListener('touchcancel', this.onTouchEnd, { passive: true });

    this.attached = true;
  }

  public detach(): void {
    if (!this.attached) return;
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);

    const target = this.options.targetElement ?? window;
    target.removeEventListener('touchstart', this.onTouchStart);
    target.removeEventListener('touchmove', this.onTouchMove);
    target.removeEventListener('touchend', this.onTouchEnd);
    target.removeEventListener('touchcancel', this.onTouchEnd);

    this.attached = false;
    this.resetKeyboard();
    this.resetJoystick();
  }

  public isPressed(key: KeyCode): boolean {
    return this.pressedKeys.has(normalizeKey(key));
  }

  public justPressed(key: KeyCode): boolean {
    const idx = this.buffer.findIndex((entry) => entry.key === normalizeKey(key));
    if (idx === -1) return false;
    this.buffer.splice(idx, 1);
    return true;
  }

  public consumeNext(): KeyCode | null {
    const entry = this.buffer.shift();
    return entry?.key ?? null;
  }

  public getBuffer(): KeyCode[] {
    this.trimBuffer();
    return this.buffer.map((entry) => entry.key);
  }

  public getJoystick(): JoystickState {
    return this.joystick;
  }

  public onKeysChange(listener: (keys: Set<KeyCode>) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index >= 0) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const key = normalizeKey(event.key);
    if (!key) return;
    if (this.options.preventDefault && shouldPreventDefault(key)) {
      event.preventDefault();
    }
    if (!this.pressedKeys.has(key)) {
      this.pressedKeys.add(key);
      this.buffer.push({ key, time: performance.now() });
      this.trimBuffer();
      this.notify();
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    const key = normalizeKey(event.key);
    if (!key) return;
    this.pressedKeys.delete(key);
    this.notify();
  }

  private handleTouchStart(event: Event): void {
    if (!isTouchEvent(event)) return;
    const touch = event.touches[0];
    if (!touch) return;
    this.touchOrigin = { x: touch.clientX, y: touch.clientY };
    this.joystick = { active: true, x: 0, y: 0, angle: 0, intensity: 0 };
  }

  private handleTouchMove(event: Event): void {
    if (!isTouchEvent(event)) return;
    if (!this.touchOrigin) return;
    const touch = event.touches[0];
    if (!touch) return;

    const dx = touch.clientX - this.touchOrigin.x;
    const dy = touch.clientY - this.touchOrigin.y;
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    const intensity = clamp(magnitude / 80, 0, 1);
    const angle = Math.atan2(dy, dx);

    this.joystick = {
      active: true,
      x: Math.cos(angle) * intensity,
      y: Math.sin(angle) * intensity,
      angle,
      intensity,
    };
  }

  private resetJoystick(): void {
    this.touchOrigin = null;
    this.joystick = { active: false, x: 0, y: 0, angle: 0, intensity: 0 };
  }

  private resetKeyboard(): void {
    this.pressedKeys.clear();
    this.buffer.length = 0;
    this.notify();
  }

  private trimBuffer(): void {
    const now = performance.now();
    while (this.buffer.length > this.options.bufferSize) {
      this.buffer.shift();
    }
    while (this.buffer.length > 0 && now - this.buffer[0].time > this.options.bufferDuration) {
      this.buffer.shift();
    }
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.pressedKeys));
  }
}

function normalizeKey(key: string | undefined): KeyCode {
  if (!key) return '';
  switch (key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'Shift':
    case 'Enter':
    case ' ': // Spacebar
    case 'Escape':
    case 'r':
    case 'R':
      return key === ' ' ? 'Space' : key;
    default:
      return key.length === 1 ? key : key;
  }
}

function shouldPreventDefault(key: string): boolean {
  return key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight' || key === 'Enter' || key === ' ';
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function isTouchEvent(event: Event): event is TouchEvent {
  return typeof TouchEvent !== 'undefined' && event instanceof TouchEvent;
}
