import { createContext, useContext, useCallback } from 'react';
import en from './translations/en.json';
import de from './translations/de.json';

export const translations = {
  en,
  de,
} as const;

export type Language = keyof typeof translations;

type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

type DotNestedKeys<T> = (T extends object ?
  { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}` }[Exclude<keyof T, symbol>]
  : '') extends infer D ? Extract<D, string> : never;

type TranslationPath = DotNestedKeys<typeof en> | 'notifications.unread_plural';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationPath) => string;
}

export const I18nContext = createContext<I18nContextType | null>(null);

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }

  const t = useCallback((key: TranslationPath) => {
    const keys = key.split('.');
    let value: any = translations[context.language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  }, [context.language]);

  return {
    language: context.language,
    setLanguage: context.setLanguage,
    t,
  };
} 