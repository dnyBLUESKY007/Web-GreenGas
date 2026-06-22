import { getLocale, setLocale, t } from '@/i18n';
import type { Locale } from '@/types';

const LOCALE_OPTIONS: readonly { readonly locale: Locale; readonly labelKey: string }[] = [
  { locale: 'en', labelKey: 'lang.en' },
  { locale: 'zh', labelKey: 'lang.zh' },
  { locale: 'ru', labelKey: 'lang.ru' },
] as const;

export function createLangSwitcher(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'lang-switcher';
  wrapper.setAttribute('role', 'group');
  wrapper.setAttribute('aria-label', 'Language');

  const currentLocale = getLocale();

  for (const option of LOCALE_OPTIONS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'lang-switcher__btn';
    button.textContent = t(option.labelKey);
    button.setAttribute('data-locale', option.locale);
    button.setAttribute('aria-pressed', String(option.locale === currentLocale));

    if (option.locale === currentLocale) {
      button.classList.add('lang-switcher__btn--active');
    }

    button.addEventListener('click', () => {
      setLocale(option.locale);
    });

    wrapper.appendChild(button);
  }

  return wrapper;
}
