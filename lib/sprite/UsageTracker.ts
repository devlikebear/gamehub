/**
 * Gemini API 사용량 추적 시스템
 * 로컬 스토리지 기반 비용 모니터링
 */

'use client';

import type { UsageRecord } from './types';

export class UsageTracker {
  private static readonly STORAGE_KEY = 'gamehub_gemini_usage';

  // Gemini API 가격 (2025년 1월 기준 예상)
  private static readonly PRICING = {
    imageGeneration: 0.02, // $0.02 per image (예상)
  };

  /**
   * 사용량 기록
   */
  static recordUsage(
    operation: 'sprite' | 'animation' | 'spritesheet',
    imageCount: number,
    cached: boolean = false
  ): void {
    const cost = cached ? 0 : imageCount * this.PRICING.imageGeneration;

    const record: UsageRecord = {
      timestamp: Date.now(),
      operation,
      imageCount,
      estimatedCost: cost,
      cached,
    };

    const history = this.getUsageHistory();
    history.push(record);

    // 최근 30일만 보관
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const filtered = history.filter((r) => r.timestamp > thirtyDaysAgo);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  /**
   * 사용량 히스토리 조회
   */
  static getUsageHistory(): UsageRecord[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * 월별 사용량 계산
   */
  static getMonthlyUsage(): {
    totalImages: number;
    totalCost: number;
    cachedImages: number;
    byOperation: Record<string, number>;
  } {
    const history = this.getUsageHistory();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recent = history.filter((r) => r.timestamp > thirtyDaysAgo);

    const totalImages = recent.reduce((sum, r) => sum + r.imageCount, 0);
    const totalCost = recent.reduce((sum, r) => sum + r.estimatedCost, 0);
    const cachedImages = recent.filter((r) => r.cached).reduce((sum, r) => sum + r.imageCount, 0);

    const byOperation: Record<string, number> = {};
    recent.forEach((r) => {
      byOperation[r.operation] = (byOperation[r.operation] || 0) + r.estimatedCost;
    });

    return { totalImages, totalCost, cachedImages, byOperation };
  }

  /**
   * 일일 사용량 조회
   */
  static getTodayUsage(): {
    totalImages: number;
    totalCost: number;
  } {
    const history = this.getUsageHistory();
    const today = new Date().setHours(0, 0, 0, 0);
    const todayUsage = history.filter((r) => r.timestamp >= today);

    const totalImages = todayUsage.reduce((sum, r) => sum + r.imageCount, 0);
    const totalCost = todayUsage.reduce((sum, r) => sum + r.estimatedCost, 0);

    return { totalImages, totalCost };
  }

  /**
   * 일일 한도 확인
   */
  static checkDailyLimit(limit: number = 50): boolean {
    const { totalImages } = this.getTodayUsage();
    return totalImages < limit;
  }

  /**
   * 예상 비용 계산
   */
  static estimateCost(imageCount: number): number {
    return imageCount * this.PRICING.imageGeneration;
  }

  /**
   * 사용량 히스토리 삭제
   */
  static clearUsageHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
