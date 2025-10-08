'use client';

import { useEffect, useState } from 'react';

/**
 * Service Worker 등록 및 PWA 설치 프롬프트 관리
 */
export default function ServiceWorkerRegistration() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // Service Worker 등록
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      registerServiceWorker();
    }
  }, []);

  // PWA 설치 프롬프트 감지
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // 브라우저의 기본 설치 프롬프트 방지
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallButton(true);
      console.log('[PWA] Install prompt ready');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // 앱 설치 상태 감지
  useEffect(() => {
    const handleAppInstalled = () => {
      console.log('[PWA] App installed');
      setShowInstallButton(false);
      setInstallPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  /**
   * Service Worker 등록
   */
  async function registerServiceWorker() {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      setRegistration(reg);

      // 업데이트 확인
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        console.log('[PWA] Service Worker update found');

        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[PWA] New content available, please refresh');
            // 선택적: 사용자에게 새로고침 알림
          }
        });
      });

      console.log('[PWA] Service Worker registered:', reg.scope);
    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
    }
  }

  /**
   * PWA 설치 실행
   */
  async function handleInstallClick() {
    if (!installPrompt) return;

    // 설치 프롬프트 표시
    (installPrompt as any).prompt();

    // 사용자 선택 대기
    const { outcome } = await (installPrompt as any).userChoice;

    console.log('[PWA] Install choice:', outcome);

    // 프롬프트 초기화
    setInstallPrompt(null);
    setShowInstallButton(false);
  }

  // 설치 버튼 (선택적으로 UI에 표시)
  if (!showInstallButton) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <button
        onClick={handleInstallClick}
        className="pixel-text text-xs bg-neon-pink/90 hover:bg-neon-pink text-black px-6 py-3 rounded-lg shadow-[0_0_20px_rgba(255,16,240,0.6)] hover:shadow-[0_0_30px_rgba(255,16,240,0.8)] transition-all duration-300 flex items-center gap-2"
        aria-label="게임허브 앱 설치"
      >
        <span className="text-lg">📱</span>
        <span>앱으로 설치</span>
      </button>
    </div>
  );
}
