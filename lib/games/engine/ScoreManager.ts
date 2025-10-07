export interface ScoreOptions {
  comboDecayMs?: number;
  comboStep?: number;
  maxComboMultiplier?: number;
}

const DEFAULT_OPTIONS: Required<ScoreOptions> = {
  comboDecayMs: 1200,
  comboStep: 0.15,
  maxComboMultiplier: 3,
};

export class ScoreManager {
  private readonly options: Required<ScoreOptions>;
  private score = 0;
  private combo = 0;
  private multiplier = 1;
  private comboTimer = 0;
  private bestCombo = 0;

  constructor(options: ScoreOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  public reset(): void {
    this.score = 0;
    this.combo = 0;
    this.multiplier = 1;
    this.comboTimer = 0;
    this.bestCombo = 0;
  }

  public tick(deltaTime: number): void {
    if (this.combo <= 0) return;
    this.comboTimer -= deltaTime;
    if (this.comboTimer <= 0) {
      this.combo = Math.max(0, this.combo - 1);
      this.updateMultiplier();
      this.comboTimer = this.options.comboDecayMs;
    }
  }

  public add(points: number, comboIncrement: number = 1): number {
    if (comboIncrement > 0) {
      this.combo += comboIncrement;
      this.bestCombo = Math.max(this.bestCombo, this.combo);
      this.comboTimer = this.options.comboDecayMs;
    }
    this.updateMultiplier();
    const gained = Math.round(points * this.multiplier);
    this.score += gained;
    return gained;
  }

  public breakCombo(): void {
    this.combo = 0;
    this.comboTimer = 0;
    this.updateMultiplier();
  }

  public getScore(): number {
    return this.score;
  }

  public getCombo(): number {
    return this.combo;
  }

  public getMultiplier(): number {
    return this.multiplier;
  }

  public getBestCombo(): number {
    return this.bestCombo;
  }

  private updateMultiplier(): void {
    if (this.combo <= 1) {
      this.multiplier = 1;
      return;
    }
    const additional = Math.min(this.combo * this.options.comboStep, this.options.maxComboMultiplier - 1);
    this.multiplier = 1 + additional;
  }
}
