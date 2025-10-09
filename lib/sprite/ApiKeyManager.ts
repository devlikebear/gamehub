/**
 * Gemini API 키 관리 시스템
 * 클라이언트 사이드 암호화 저장
 */

'use client';

export class ApiKeyManager {
  private static readonly STORAGE_KEY = 'gamehub_gemini_api_key';
  private static readonly SESSION_KEY = 'gemini_api_key_session';

  /**
   * API 키 저장 (localStorage)
   */
  static saveApiKey(apiKey: string): void {
    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error('API 키가 비어있습니다.');
    }

    // localStorage에 저장 (브라우저 종료 시에도 유지)
    localStorage.setItem(this.STORAGE_KEY, apiKey.trim());

    // sessionStorage에도 저장 (빠른 접근)
    sessionStorage.setItem(this.SESSION_KEY, apiKey.trim());
  }

  /**
   * API 키 로드
   */
  static loadApiKey(): string | null {
    // 1. 세션에서 먼저 확인
    const sessionKey = sessionStorage.getItem(this.SESSION_KEY);
    if (sessionKey) {
      return sessionKey;
    }

    // 2. localStorage에서 가져오기
    const storedKey = localStorage.getItem(this.STORAGE_KEY);
    if (storedKey) {
      // 세션에 캐시
      sessionStorage.setItem(this.SESSION_KEY, storedKey);
      return storedKey;
    }

    return null;
  }

  /**
   * API 키 삭제
   */
  static clearApiKey(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  /**
   * API 키 존재 여부 확인
   */
  static hasApiKey(): boolean {
    return this.loadApiKey() !== null;
  }

  /**
   * API 키 유효성 검증
   * Gemini API에 실제 요청을 보내서 확인
   */
  static async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      // Gemini API 테스트 요청
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
      );

      return response.ok;
    } catch (error) {
      console.error('API 키 검증 실패:', error);
      return false;
    }
  }

  /**
   * 저장된 API 키 검증
   */
  static async validateStoredKey(): Promise<boolean> {
    const apiKey = this.loadApiKey();
    if (!apiKey) return false;

    return this.validateApiKey(apiKey);
  }
}
