/**
 * Keyboard Shortcuts Types
 * 키보드 단축키 타입 정의
 */

export type ShortcutCategory = 'global' | 'game' | 'navigation';
export type ModifierKey = 'ctrl' | 'shift' | 'alt' | 'meta';

export interface KeyboardShortcut {
  id: string;
  category: ShortcutCategory;
  key: string; // 주 키 (예: 'Space', '/', '?')
  modifiers?: ModifierKey[]; // 수정자 키 (Ctrl, Shift 등)
  description: string;
  icon?: string; // 이모지 아이콘
  descriptionKo?: string; // 한국어 설명
}

export interface ShortcutGroup {
  category: ShortcutCategory;
  title: string;
  titleKo: string;
  shortcuts: KeyboardShortcut[];
}
