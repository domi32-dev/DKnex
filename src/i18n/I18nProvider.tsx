'use client';

import { ReactNode, useState, useEffect } from 'react';
import { I18nContext, Language, translations } from './translations';

// Get browser language and check if we support it
const getBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = window.navigator.language.split('-')[0];
  return browserLang in translations ? (browserLang as Language) : 'en';
};

// Get stored language or browser language
const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  
  const storedLang = localStorage.getItem('language') as Language;
  return storedLang && storedLang in translations ? storedLang : getBrowserLanguage();
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Set initial language on mount
    setLanguageState(getInitialLanguage());
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // Optional: Update HTML lang attribute
    document.documentElement.lang = lang;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t: (key) => {
          const keys = key.split('.');
          let value: unknown = translations[language];
          
          for (const k of keys) {
            value = (value as Record<string, unknown>)?.[k];
          }
          
          return (typeof value === 'string' ? value : key);
        },
      }}
    >
      {children}
    </I18nContext.Provider>
  );
} 