/**
 * ShortcutsProvider Component
 * 전역 키보드 단축키 핸들러 및 모달 관리
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';
import { useI18n } from '@/lib/i18n/provider';

export function ShortcutsProvider({ children }: { children: React.ReactNode }) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const router = useRouter();
  const { locale } = useI18n();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // input/textarea에서는 단축키 비활성화
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // ? 키: 도움말 열기/닫기
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsHelpOpen((prev) => !prev);
        return;
      }

      // Shift + 키 네비게이션
      if (e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        switch (e.key.toUpperCase()) {
          case 'H':
            e.preventDefault();
            router.push('/');
            break;
          case 'G':
            e.preventDefault();
            router.push('/games');
            break;
          case 'L':
            e.preventDefault();
            router.push('/leaderboard');
            break;
          case 'A':
            e.preventDefault();
            router.push('/achievements');
            break;
          case 'I':
            e.preventDefault();
            router.push('/about');
            break;
        }
      }
    },
    [router]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {children}
      <KeyboardShortcutsHelp isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} language={locale} />
    </>
  );
}
