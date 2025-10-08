'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Locale } from './index';
import { getDictionary, getLocale, setLocale as setStoredLocale } from './index';
import type { Translations } from './locales/ko';

interface I18nContextType {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ko');
  const [t, setTranslations] = useState<Translations>(getDictionary('ko'));

  useEffect(() => {
    const currentLocale = getLocale();
    setLocaleState(currentLocale);
    setTranslations(getDictionary(currentLocale));
    document.documentElement.lang = currentLocale;
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setTranslations(getDictionary(newLocale));
    setStoredLocale(newLocale);
    window.location.reload();
  };

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
