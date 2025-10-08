'use client';

import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import AudioSettings from '@/components/ui/AudioSettings';
import { useI18n } from '@/lib/i18n/provider';

export default function Navbar() {
  const { t } = useI18n();

  const handleShortcutsClick = () => {
    // Trigger '?' key event to open shortcuts modal
    const event = new KeyboardEvent('keydown', { key: '?' });
    window.dispatchEvent(event);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-neon-cyan/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="pixel-text text-xl text-bright group-hover:neon-text transition-all duration-300">
              🕹️ GAMEHUB
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/games"
              className="pixel-text text-xs text-bright hover:text-bright-pink transition-colors duration-300"
            >
              {t.common.games}
            </Link>
            <Link
              href="/leaderboard"
              className="pixel-text text-xs text-bright hover:text-bright-yellow transition-colors duration-300"
            >
              {t.common.leaderboard}
            </Link>
            <Link
              href="/achievements"
              className="pixel-text text-xs text-bright hover:text-bright-green transition-colors duration-300"
            >
              {t.common.achievements || '업적'}
            </Link>
            <Link
              href="/about"
              className="pixel-text text-xs text-bright hover:text-bright-purple transition-colors duration-300"
            >
              {t.common.about}
            </Link>

            {/* Keyboard Shortcuts */}
            <button
              onClick={handleShortcutsClick}
              className="text-bright hover:text-bright-cyan transition-colors duration-300"
              title={t.common.keyboardShortcuts || '키보드 단축키'}
              aria-label={t.common.keyboardShortcuts || '키보드 단축키'}
            >
              <span className="text-lg">⌨️</span>
            </button>

            {/* Audio Settings */}
            <AudioSettings />

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>

          {/* Mobile: Keyboard Shortcuts + Audio Settings + Language Switcher + Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={handleShortcutsClick}
              className="text-bright hover:text-bright-cyan transition-colors duration-300"
              title={t.common.keyboardShortcuts || '키보드 단축키'}
              aria-label={t.common.keyboardShortcuts || '키보드 단축키'}
            >
              <span className="text-lg">⌨️</span>
            </button>
            <AudioSettings />
            <LanguageSwitcher />
            <button className="text-neon-cyan hover:text-neon-pink transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
