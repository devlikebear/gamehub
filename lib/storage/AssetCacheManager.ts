/**
 * IndexedDB 기반 에셋 캐시 관리자
 *
 * 생성된 에셋(이미지, 오디오)을 브라우저에 저장하여
 * API 호출 비용을 절감하고 성능을 향상시킵니다.
 */

import type {
  AssetGenerationParams,
  CachedAsset,
  AssetMetadata,
  CacheStats,
} from './types';

/**
 * AssetCacheManager 클래스
 *
 * @example
 * ```ts
 * // 캐시 확인
 * const cached = await assetCache.get(params);
 * if (cached) {
 *   return cached; // API 호출 없이 캐시에서 로드
 * }
 *
 * // API 호출 후 캐시 저장
 * const blob = await callGeminiAPI(params);
 * await assetCache.save(params, blob, 'sprite', metadata);
 * ```
 */
class AssetCacheManager {
  private dbName = 'gamehub-assets';
  private version = 1;
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  /**
   * IndexedDB 초기화
   */
  async init(): Promise<void> {
    // 이미 초기화 중이면 기다림
    if (this.initPromise) {
      return this.initPromise;
    }

    // 이미 초기화 완료
    if (this.db) {
      return Promise.resolve();
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        this.initPromise = null;
        reject(new Error(`IndexedDB 초기화 실패: ${request.error?.message}`));
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.initPromise = null;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 에셋 저장소 생성
        if (!db.objectStoreNames.contains('assets')) {
          const store = db.createObjectStore('assets', { keyPath: 'id' });

          // 인덱스 생성 (빠른 검색)
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('lastAccessedAt', 'lastAccessedAt', {
            unique: false,
          });
        }
      };
    });

    return this.initPromise;
  }

  /**
   * 파라미터로 고유 ID 생성 (SHA-256 해시)
   */
  private async generateId(params: AssetGenerationParams): Promise<string> {
    const paramsString = JSON.stringify(params, Object.keys(params).sort());
    const encoder = new TextEncoder();
    const data = encoder.encode(paramsString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * 캐시에서 에셋 검색
   *
   * @param params 생성 파라미터
   * @returns 캐시된 Blob 또는 null
   */
  async get(params: AssetGenerationParams): Promise<Blob | null> {
    if (!this.db) await this.init();

    const id = await this.generateId(params);

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['assets'], 'readwrite');
      const store = transaction.objectStore('assets');
      const request = store.get(id);

      request.onsuccess = () => {
        const result: CachedAsset | undefined = request.result;

        if (result) {
          // 마지막 접근 시각 업데이트 (LRU용)
          result.lastAccessedAt = Date.now();
          store.put(result);

          console.log('✅ [AssetCache] 캐시 히트:', id.slice(0, 8));
          resolve(result.blob);
        } else {
          console.log('❌ [AssetCache] 캐시 미스:', id.slice(0, 8));
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 에셋 저장
   *
   * @param params 생성 파라미터
   * @param blob 파일 데이터
   * @param type 에셋 타입
   * @param metadata 메타데이터
   */
  async save(
    params: AssetGenerationParams,
    blob: Blob,
    type: CachedAsset['type'],
    metadata: AssetMetadata
  ): Promise<void> {
    if (!this.db) await this.init();

    const id = await this.generateId(params);

    const asset: CachedAsset = {
      id,
      type,
      params,
      blob,
      createdAt: Date.now(),
      lastAccessedAt: Date.now(),
      size: blob.size,
      metadata,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['assets'], 'readwrite');
      const store = transaction.objectStore('assets');
      const request = store.put(asset);

      request.onsuccess = () => {
        console.log(
          `💾 [AssetCache] 저장 완료: ${type} (${(blob.size / 1024).toFixed(1)}KB)`
        );
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 전체 캐시 크기 계산
   *
   * @returns 총 크기 (바이트)
   */
  async getTotalSize(): Promise<number> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['assets'], 'readonly');
      const store = transaction.objectStore('assets');
      const request = store.getAll();

      request.onsuccess = () => {
        const assets: CachedAsset[] = request.result;
        const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0);
        resolve(totalSize);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 오래된 캐시 자동 정리 (LRU - Least Recently Used)
   *
   * @param maxSizeMB 최대 캐시 크기 (MB)
   */
  async cleanup(maxSizeMB: number = 100): Promise<void> {
    if (!this.db) await this.init();

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const totalSize = await this.getTotalSize();

    if (totalSize <= maxSizeBytes) {
      console.log(
        `✅ [AssetCache] 캐시 정리 불필요 (${(totalSize / 1024 / 1024).toFixed(1)}MB / ${maxSizeMB}MB)`
      );
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['assets'], 'readwrite');
      const store = transaction.objectStore('assets');
      const index = store.index('lastAccessedAt');
      const request = index.openCursor(); // 오래된 순서대로

      let currentSize = totalSize;
      let deletedCount = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

        if (cursor && currentSize > maxSizeBytes) {
          const asset: CachedAsset = cursor.value;
          currentSize -= asset.size;
          deletedCount++;
          cursor.delete(); // 오래된 항목 삭제
          cursor.continue();
        } else {
          console.log(
            `🗑️ [AssetCache] 정리 완료: ${deletedCount}개 삭제 (${(currentSize / 1024 / 1024).toFixed(1)}MB)`
          );
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 특정 타입 캐시 삭제
   *
   * @param type 에셋 타입
   */
  async clearByType(type: CachedAsset['type']): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['assets'], 'readwrite');
      const store = transaction.objectStore('assets');
      const index = store.index('type');
      const request = index.openCursor(IDBKeyRange.only(type));

      let deletedCount = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

        if (cursor) {
          cursor.delete();
          deletedCount++;
          cursor.continue();
        } else {
          console.log(
            `🗑️ [AssetCache] ${type} 캐시 삭제 완료: ${deletedCount}개`
          );
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 전체 캐시 삭제
   */
  async clearAll(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['assets'], 'readwrite');
      const store = transaction.objectStore('assets');
      const request = store.clear();

      request.onsuccess = () => {
        console.log('🗑️ [AssetCache] 전체 캐시 삭제 완료');
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 캐시 통계 조회
   *
   * @returns 캐시 통계
   */
  async getStats(): Promise<CacheStats> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['assets'], 'readonly');
      const store = transaction.objectStore('assets');
      const request = store.getAll();

      request.onsuccess = () => {
        const assets: CachedAsset[] = request.result;

        const byType: Record<string, number> = {};
        let totalSize = 0;

        assets.forEach((asset) => {
          totalSize += asset.size;
          byType[asset.type] = (byType[asset.type] || 0) + 1;
        });

        resolve({
          totalAssets: assets.length,
          totalSizeMB: totalSize / (1024 * 1024),
          byType,
        });
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 데이터베이스 연결 종료
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('🔌 [AssetCache] 데이터베이스 연결 종료');
    }
  }
}

// 싱글톤 인스턴스 내보내기
export const assetCache = new AssetCacheManager();
