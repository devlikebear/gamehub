'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n/provider';

export default function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-black/80 backdrop-blur-sm border-t border-[#9d00ff]/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="pixel-text text-sm mb-4" style={{ color: '#00f0ff' }}>GAMEHUB</h3>
            <p className="pixel-text text-xs" style={{ color: '#00f0ff' }}>
              {t.common.footerDescription}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="pixel-text text-xs mb-4" style={{ color: '#ff10f0' }}>{t.common.links}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/games" className="pixel-text text-xs hover:text-bright-pink transition-colors" style={{ color: '#00f0ff' }}>
                  {t.common.games}
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="pixel-text text-xs hover:text-bright-yellow transition-colors" style={{ color: '#00f0ff' }}>
                  {t.common.leaderboard}
                </Link>
              </li>
              <li>
                <Link href="/about" className="pixel-text text-xs hover:text-bright-purple transition-colors" style={{ color: '#00f0ff' }}>
                  {t.common.about}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="pixel-text text-xs mb-4" style={{ color: '#ff10f0' }}>{t.common.connect}</h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com/devlikebear/gamehub"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{ color: '#00f0ff' }}
                aria-label="GitHub"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-[#9d00ff]/30">
          <p className="pixel-text text-xs text-center mb-3" style={{ color: '#9d00ff' }}>
            © {currentYear} GameHub. {t.common.openSource}
          </p>
          <p className="pixel-text text-[10px] text-center" style={{ color: '#666' }}>
            Background Music by{' '}
            <a
              href="https://oblidivmmusic.blogspot.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: '#9d00ff' }}
            >
              Oblidivm
            </a>
            {' '}•{' '}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: '#9d00ff' }}
            >
              CC-BY 4.0
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
