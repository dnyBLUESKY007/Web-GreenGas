import { getLocale, setLocale, t } from '@/i18n';
import type { Locale } from '@/types';

const LOCALE_OPTIONS: readonly { readonly locale: Locale; readonly label: string }[] = [
  { locale: 'en', label: 'English' },
  { locale: 'zh', label: '中文' },
  { locale: 'ru', label: 'Русский' },
] as const;

export function createLangSwitcher(onLocaleSelect?: () => void): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'lang-switcher';
  wrapper.setAttribute('role', 'group');
  wrapper.setAttribute('aria-label', t('nav.language.group'));

  const currentLocale = getLocale();

  for (const option of LOCALE_OPTIONS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'lang-switcher__btn';
    button.textContent = option.label;
    button.setAttribute('data-locale', option.locale);
    button.setAttribute('aria-pressed', String(option.locale === currentLocale));

    if (option.locale === currentLocale) {
      button.classList.add('lang-switcher__btn--active');
    }

    button.addEventListener('click', () => {
      setLocale(option.locale);
      onLocaleSelect?.();
    });

    wrapper.appendChild(button);
  }

  return wrapper;
}
