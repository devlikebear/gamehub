/**
 * 에셋 캐시 시스템 타입 정의
 */

/**
 * 에셋 생성 파라미터 (해시 ID 생성용)
 */
export interface AssetGenerationParams {
  // 스프라이트 생성 파라미터
  prompt?: string;
  style?: string;
  size?: string;
  seed?: number;

  // 오디오 생성 파라미터
  genre?: string;
  tempo?: number;
  length?: number;
  mood?: string;
  chords?: string[];

  // 공통
  type?: 'sprite' | 'animation' | 'effect' | 'bgm' | 'sfx';
  [key: string]: string | number | string[] | undefined;
}

/**
 * 캐시된 에셋 데이터
 */
export interface CachedAsset {
  /** 고유 ID (파라미터 해시값) */
  id: string;

  /** 에셋 타입 */
  type: 'sprite' | 'animation' | 'effect' | 'bgm' | 'sfx';

  /** 생성 시 사용한 파라미터 */
  params: AssetGenerationParams;

  /** 실제 파일 데이터 (이미지/오디오) */
  blob: Blob;

  /** 생성 시각 (타임스탬프) */
  createdAt: number;

  /** 마지막 접근 시각 (LRU용) */
  lastAccessedAt: number;

  /** 파일 크기 (바이트) */
  size: number;

  /** 메타데이터 */
  metadata: AssetMetadata;
}

/**
 * 에셋 메타데이터
 */
export interface AssetMetadata {
  /** 이미지 너비 (px) */
  width?: number;

  /** 이미지 높이 (px) */
  height?: number;

  /** 오디오 길이 (초) */
  duration?: number;

  /** 파일 포맷 */
  format: 'png' | 'jpg' | 'gif' | 'wav' | 'mp3' | 'ogg';

  /** 애니메이션 프레임 수 */
  frames?: number;

  /** 추가 정보 */
  [key: string]: string | number | undefined;
}

/**
 * 캐시 통계
 */
export interface CacheStats {
  /** 총 에셋 수 */
  totalAssets: number;

  /** 총 용량 (MB) */
  totalSizeMB: number;

  /** 타입별 에셋 수 */
  byType: Record<string, number>;
}
