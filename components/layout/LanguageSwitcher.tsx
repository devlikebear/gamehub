'use client';

import { useI18n } from '@/lib/i18n/provider';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const toggleLocale = () => {
    const newLocale = locale === 'ko' ? 'en' : 'ko';
    setLocale(newLocale);
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center space-x-2 px-3 py-1.5 bg-[#00f0ff]/20 border-2 border-[#00f0ff] rounded-lg hover:bg-[#00f0ff] hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.5)]"
      aria-label="Switch language"
    >
      <span className="pixel-text text-xs font-bold" style={{ color: '#00f0ff' }}>
        {locale === 'ko' ? 'KO' : 'EN'}
      </span>
      <svg className="w-4 h-4" style={{ color: '#00f0ff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    </button>
  );
}
