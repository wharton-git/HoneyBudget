import { createContextId, useContext, $ } from '@builder.io/qwik';
import type { Language, Translations } from './types';
import { fr } from './locales/fr';
import { en } from './locales/en';

export interface I18nStore {
  lang: Language;
}

export const I18nContext = createContextId<I18nStore>('honey-budget-i18n');

export const dictionaries: Record<Language, Translations> = {
  fr,
  en,
};

export const translate = (lang: Language, key: keyof Translations, params?: Record<string, string | number>): string => {
  const dict = dictionaries[lang] || dictionaries.fr;
  let text = dict[key] || dictionaries.fr[key] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v)) as any;
    });
  }
  return text;
};

// Top-level exported translation helper
export const t = (lang: Language, key: keyof Translations, params?: Record<string, string | number>): string => {
  return translate(lang, key, params);
};

export const useI18n = () => {
  const store = useContext(I18nContext);

  const setLang$ = $((newLang: Language) => {
    store.lang = newLang;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('honey_lang', newLang);
    }
  });

  return {
    lang: store.lang,
    setLang$,
  };
};
