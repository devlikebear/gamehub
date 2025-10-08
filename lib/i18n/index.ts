import { ko } from './locales/ko';
import { en } from './locales/en';

export type Locale = 'ko' | 'en';

const dictionaries = {
  ko,
  en,
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale] || dictionaries.ko;
}

export function getLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'ko'; // Server-side default
  }

  const saved = localStorage.getItem('locale') as Locale | null;
  if (saved && (saved === 'ko' || saved === 'en')) {
    return saved;
  }

  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('ko') ? 'ko' : 'en';
}

export function setLocale(locale: Locale) {
  if (typeof window === 'undefined') return;

  localStorage.setItem('locale', locale);
  document.documentElement.lang = locale;
}
