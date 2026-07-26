import en from '@/i18n/locales/en.json';
import ru from '@/i18n/locales/ru.json';
import zh from '@/i18n/locales/zh.json';
import type { Locale } from '@/types';

const LOCALE_STORAGE_KEY = 'gg_locale';

const MESSAGES: Record<Locale, Record<string, string>> = {
  en: en as Record<string, string>,
  zh: zh as Record<string, string>,
  ru: ru as Record<string, string>,
};

const localeListeners = new Set<() => void>();

let currentLocale: Locale = resolveInitialLocale();

function resolveInitialLocale(): Locale {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);

  if (stored === 'en' || stored === 'zh' || stored === 'ru') {
    return stored;
  }

  const browserLang = navigator.language.toLowerCase();

  if (browserLang.startsWith('zh')) {
    return 'zh';
  }

  if (browserLang.startsWith('ru')) {
    return 'ru';
  }

  return 'zh';
}

function applyDocumentLocale(locale: Locale): void {
  document.documentElement.lang = locale;
}

/**
 * Initializes locale on first page load.
 */
export function initI18n(): void {
  applyDocumentLocale(currentLocale);
}

/**
 * Returns the active locale.
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * Persists locale, updates document lang, and notifies subscribers.
 */
export function setLocale(locale: Locale): void {
  if (locale === currentLocale) {
    return;
  }

  currentLocale = locale;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  applyDocumentLocale(locale);

  for (const listener of localeListeners) {
    listener();
  }
}

/**
 * Subscribes to locale changes.
 */
export function onLocaleChange(listener: () => void): () => void {
  localeListeners.add(listener);

  return () => {
    localeListeners.delete(listener);
  };
}

/**
 * Translates a static UI string by key.
 */
export function t(key: string): string {
  const localized = MESSAGES[currentLocale][key];

  if (localized !== undefined) {
    return localized;
  }

  return MESSAGES.en[key] ?? key;
}

/**
 * Resolves a localized field from a data object.
 */
export function td(obj: object, field: string): string {
  const record = obj as Readonly<Record<string, string | undefined>>;

  if (currentLocale === 'en') {
    return record[field] ?? '';
  }

  const localizedKey = `${field}_${currentLocale}`;
  return record[localizedKey] ?? record[field] ?? '';
}

/**
 * Resolves a localized list, falling back to the default list.
 */
export function getLocalizedList(
  items: readonly string[],
  itemsZh?: readonly string[],
  itemsRu?: readonly string[],
): readonly string[] {
  switch (currentLocale) {
    case 'zh':
      return itemsZh ?? items;
    case 'ru':
      return itemsRu ?? items;
    default:
      return items;
  }
}
