/**
 * GameLoop - 60 FPS 게임 루프 엔진
 *
 * requestAnimationFrame 기반으로 일정한 프레임레이트를 유지하며
 * 게임 로직을 업데이트하고 렌더링합니다.
 */

export abstract class GameLoop {
  private rafId: number | null = null;
  private lastTime: number = 0;
  private isPaused: boolean = false;
  private isRunning: boolean = false;

  // FPS 관련
  private readonly targetFPS: number = 60;
  private readonly frameTime: number = 1000 / this.targetFPS; // ~16.67ms

  // FPS 카운터 (개발 모드)
  private fpsFrames: number = 0;
  private fpsLastTime: number = 0;
  private currentFPS: number = 0;

  constructor() {
    this.lastTime = performance.now();
    this.fpsLastTime = this.lastTime;
  }

  /**
   * 게임 루프 시작
   */
  public start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.fpsLastTime = this.lastTime;

    this.onStart();
    this.loop(this.lastTime);
  }

  /**
   * 게임 루프 정지
   */
  public stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    this.isPaused = false;

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.onStop();
  }

  /**
   * 일시정지
   */
  public pause(): void {
    if (!this.isRunning || this.isPaused) return;

    this.isPaused = true;
    this.onPause();
  }

  /**
   * 재개
   */
  public resume(): void {
    if (!this.isRunning || !this.isPaused) return;

    this.isPaused = false;
    this.lastTime = performance.now();
    this.onResume();
  }

  /**
   * 일시정지 토글
   */
  public togglePause(): void {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  /**
   * 메인 게임 루프
   */
  private loop = (currentTime: number): void => {
    if (!this.isRunning) return;

    this.rafId = requestAnimationFrame(this.loop);

    // 델타 타임 계산 (ms)
    const deltaTime = currentTime - this.lastTime;

    // 프레임 스킵 방지 (최대 100ms)
    const clampedDelta = Math.min(deltaTime, 100);

    this.lastTime = currentTime;

    // FPS 계산 (1초마다 업데이트)
    this.fpsFrames++;
    if (currentTime - this.fpsLastTime >= 1000) {
      this.currentFPS = this.fpsFrames;
      this.fpsFrames = 0;
      this.fpsLastTime = currentTime;

      // 개발 모드에서 FPS 출력
      if (process.env.NODE_ENV === 'development') {
        this.onFPSUpdate(this.currentFPS);
      }
    }

    // 일시정지 상태가 아닐 때만 업데이트
    if (!this.isPaused) {
      this.update(clampedDelta);
    }

    // 항상 렌더링 (일시정지 화면도 보여줘야 함)
    this.render();
  };

  /**
   * 게임 상태 Getter
   */
  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  public getCurrentFPS(): number {
    return this.currentFPS;
  }

  /**
   * 하위 클래스에서 구현해야 하는 추상 메서드
   */

  /**
   * 게임 로직 업데이트
   * @param deltaTime 이전 프레임으로부터 경과 시간 (ms)
   */
  protected abstract update(deltaTime: number): void;

  /**
   * 게임 화면 렌더링
   */
  protected abstract render(): void;

  /**
   * 게임 시작 시 호출 (선택적)
   */
  protected onStart(): void {
    // 하위 클래스에서 필요시 오버라이드
  }

  /**
   * 게임 정지 시 호출 (선택적)
   */
  protected onStop(): void {
    // 하위 클래스에서 필요시 오버라이드
  }

  /**
   * 일시정지 시 호출 (선택적)
   */
  protected onPause(): void {
    // 하위 클래스에서 필요시 오버라이드
  }

  /**
   * 재개 시 호출 (선택적)
   */
  protected onResume(): void {
    // 하위 클래스에서 필요시 오버라이드
  }

  /**
   * FPS 업데이트 시 호출 (개발 모드)
   */
  protected onFPSUpdate(fps: number): void {
    // 하위 클래스에서 필요시 오버라이드
    console.log(`FPS: ${fps}`);
  }
}
