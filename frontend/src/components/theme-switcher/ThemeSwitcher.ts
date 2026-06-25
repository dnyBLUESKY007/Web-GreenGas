import { getTheme, setTheme } from '@/theme';
import { t } from '@/i18n';
import type { Theme } from '@/types';

const THEME_OPTIONS: readonly { readonly theme: Theme; readonly labelKey: string }[] = [
  { theme: 'emerald-lime', labelKey: 'theme.lime' },
  { theme: 'emerald-steel', labelKey: 'theme.steel' },
  { theme: 'emerald-gold', labelKey: 'theme.gold' },
] as const;

export function createThemeSwitcher(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'theme-switcher';
  wrapper.setAttribute('role', 'group');
  wrapper.setAttribute('aria-label', 'Color theme');

  const currentTheme = getTheme();

  for (const option of THEME_OPTIONS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-switcher__btn';
    button.textContent = t(option.labelKey);
    button.setAttribute('data-theme', option.theme);
    button.setAttribute('aria-pressed', String(option.theme === currentTheme));

    if (option.theme === currentTheme) {
      button.classList.add('theme-switcher__btn--active');
    }

    button.addEventListener('click', () => {
      setTheme(option.theme);
    });

    wrapper.appendChild(button);
  }

  return wrapper;
}
