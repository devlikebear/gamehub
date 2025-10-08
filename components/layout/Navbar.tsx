'use client';

import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import AudioSettings from '@/components/ui/AudioSettings';
import { useI18n } from '@/lib/i18n/provider';

export default function Navbar() {
  const { t } = useI18n();
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
              href="/about"
              className="pixel-text text-xs text-bright hover:text-bright-purple transition-colors duration-300"
            >
              {t.common.about}
            </Link>

            {/* Audio Settings */}
            <AudioSettings />

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>

          {/* Mobile: Audio Settings + Language Switcher + Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
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
