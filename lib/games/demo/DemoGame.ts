import { BaseGame, GameConfig } from '../engine';

/**
 * DemoGame - 게임 루프 엔진 테스트용 데모 게임
 *
 * 화면을 돌아다니는 공을 표시하여 게임 루프가 정상 작동하는지 확인합니다.
 */

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export class DemoGame extends BaseGame {
  private ball: Ball;

  constructor(config: GameConfig) {
    super(config);

    // 공 초기화
    this.ball = {
      x: this.width / 2,
      y: this.height / 2,
      vx: 0.2,
      vy: 0.15,
      radius: 20,
      color: '#00f0ff', // neon-cyan
    };
  }

  protected onStart(): void {
    console.log('Demo Game Started');
  }

  protected update(deltaTime: number): void {
    // 공 이동
    this.ball.x += this.ball.vx * deltaTime;
    this.ball.y += this.ball.vy * deltaTime;

    // 벽 충돌 검사
    if (this.ball.x - this.ball.radius <= 0 || this.ball.x + this.ball.radius >= this.width) {
      this.ball.vx *= -1;
      this.ball.x = Math.max(this.ball.radius, Math.min(this.width - this.ball.radius, this.ball.x));
    }

    if (this.ball.y - this.ball.radius <= 0 || this.ball.y + this.ball.radius >= this.height) {
      this.ball.vy *= -1;
      this.ball.y = Math.max(this.ball.radius, Math.min(this.height - this.ball.radius, this.ball.y));
    }
  }

  protected render(): void {
    // 화면 지우기
    this.clearCanvas('#0a0a0f');

    // 공 그리기
    this.drawCircle(this.ball.x, this.ball.y, this.ball.radius, this.ball.color);

    // FPS 표시
    this.drawText(`FPS: ${this.getCurrentFPS()}`, 10, 10, {
      font: '12px monospace',
      color: '#00ff00',
    });

    // 상태 표시
    if (this.getIsPaused()) {
      this.drawText('PAUSED', this.width / 2 - 60, this.height / 2, {
        font: '24px "Press Start 2P"',
        color: '#ff10f0',
      });
    }

    // 조작법 안내
    this.drawText('Press SPACE to pause/resume', 10, this.height - 30, {
      font: '10px monospace',
      color: '#ffffff',
    });
  }

  protected onPause(): void {
    console.log('Demo Game Paused');
  }

  protected onResume(): void {
    console.log('Demo Game Resumed');
  }

  protected onFPSUpdate(fps: number): void {
    // FPS가 50 이하로 떨어지면 경고
    if (fps < 50) {
      console.warn(`Low FPS: ${fps}`);
    }
  }
}
