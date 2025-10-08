/**
 * KeyboardShortcutsHelp Component
 * 키보드 단축키 가이드 모달
 */

'use client';

import { useEffect } from 'react';
import { shortcutGroups } from '@/lib/shortcuts/data';
import type { KeyboardShortcut, ModifierKey } from '@/lib/shortcuts/types';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'ko' | 'en';
}

export function KeyboardShortcutsHelp({ isOpen, onClose, language = 'ko' }: KeyboardShortcutsHelpProps) {
  // Esc 키로 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black border-2 border-bright-cyan rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.5)] m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-black border-b border-bright-cyan/30 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="pixel-text text-2xl text-bright-cyan mb-1">
              {language === 'ko' ? '⌨️ 키보드 단축키' : '⌨️ Keyboard Shortcuts'}
            </h2>
            <p className="text-xs text-gray-400">
              {language === 'ko'
                ? '게임을 더 빠르게 플레이하고 탐색하세요'
                : 'Play games and navigate faster'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-bright-cyan/60 text-bright-cyan rounded hover:bg-bright-cyan/10 transition-all duration-300 text-sm pixel-text"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {shortcutGroups.map((group) => (
            <div key={group.category}>
              <h3 className="pixel-text text-lg text-bright-yellow mb-4 border-b border-bright-yellow/30 pb-2">
                {language === 'ko' ? group.titleKo : group.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.shortcuts.map((shortcut) => (
                  <ShortcutItem key={shortcut.id} shortcut={shortcut} language={language} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-black border-t border-bright-cyan/30 px-6 py-4 text-center">
          <p className="text-xs text-gray-400">
            {language === 'ko' ? (
              <>
                <kbd className="kbd">?</kbd> 키를 눌러 이 가이드를 다시 열 수 있습니다
              </>
            ) : (
              <>
                Press <kbd className="kbd">?</kbd> to open this guide again
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * 개별 단축키 항목 컴포넌트
 */
function ShortcutItem({ shortcut, language }: { shortcut: KeyboardShortcut; language: 'ko' | 'en' }) {
  return (
    <div className="flex items-center justify-between bg-black/40 border border-bright-cyan/20 rounded-lg p-3 hover:border-bright-cyan/60 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-300">
      <div className="flex items-center gap-3">
        {shortcut.icon && <span className="text-2xl">{shortcut.icon}</span>}
        <span className="text-sm text-gray-300">
          {language === 'ko' ? shortcut.descriptionKo || shortcut.description : shortcut.description}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {shortcut.modifiers?.map((modifier) => (
          <KeyBadge key={modifier} text={getModifierLabel(modifier)} />
        ))}
        <KeyBadge text={shortcut.key} isPrimary />
      </div>
    </div>
  );
}

/**
 * 키보드 키 배지 컴포넌트
 */
function KeyBadge({ text, isPrimary = false }: { text: string; isPrimary?: boolean }) {
  return (
    <kbd
      className={`kbd px-3 py-1 text-xs font-bold rounded shadow-md ${
        isPrimary
          ? 'bg-bright-cyan/20 border-2 border-bright-cyan text-bright-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)]'
          : 'bg-gray-800 border border-gray-600 text-gray-300'
      }`}
    >
      {text}
    </kbd>
  );
}

/**
 * 수정자 키 라벨 가져오기
 */
function getModifierLabel(modifier: ModifierKey): string {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  switch (modifier) {
    case 'ctrl':
      return isMac ? '⌃' : 'Ctrl';
    case 'shift':
      return isMac ? '⇧' : 'Shift';
    case 'alt':
      return isMac ? '⌥' : 'Alt';
    case 'meta':
      return isMac ? '⌘' : 'Win';
    default:
      return modifier;
  }
}
