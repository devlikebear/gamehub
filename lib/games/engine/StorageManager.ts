interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const MEMORY_STORAGE = new Map<string, string>();

const memoryAdapter: StorageLike = {
  getItem: (key) => MEMORY_STORAGE.get(key) ?? null,
  setItem: (key, value) => {
    MEMORY_STORAGE.set(key, value);
  },
  removeItem: (key) => {
    MEMORY_STORAGE.delete(key);
  },
};

export interface StorageManagerOptions {
  namespace?: string;
}

export class StorageManager {
  private readonly storage: StorageLike;
  private readonly namespace: string;

  constructor(options: StorageManagerOptions = {}) {
    this.storage = typeof window !== 'undefined' && window.localStorage ? window.localStorage : memoryAdapter;
    this.namespace = options.namespace ?? 'gamehub';
  }

  public getHighScore(gameId: string): number {
    const value = this.storage.getItem(this.key(`score:${gameId}`));
    return value ? Number(value) : 0;
  }

  public setHighScore(gameId: string, score: number): void {
    const current = this.getHighScore(gameId);
    if (score <= current) return;
    this.storage.setItem(this.key(`score:${gameId}`), String(Math.floor(score)));
  }

  public getSettings<T = unknown>(key: string, fallback: T): T {
    const value = this.storage.getItem(this.key(`settings:${key}`));
    if (!value) return fallback;
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.warn('[StorageManager] Failed to parse settings', error);
      return fallback;
    }
  }

  public setSettings<T = unknown>(key: string, value: T): void {
    try {
      this.storage.setItem(this.key(`settings:${key}`), JSON.stringify(value));
    } catch (error) {
      console.warn('[StorageManager] Failed to persist settings', error);
    }
  }

  public clear(): void {
    if (this.storage === memoryAdapter) {
      MEMORY_STORAGE.clear();
      return;
    }

    const prefix = `${this.namespace}::`;
    const keys = Object.keys(this.storage);
    keys
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => this.storage.removeItem(key));
  }

  private key(raw: string): string {
    return `${this.namespace}::${raw}`;
  }
}
