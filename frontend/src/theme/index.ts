import type { Theme } from '@/types';

const THEME_STORAGE_KEY = 'gg_theme';

const themeListeners = new Set<() => void>();

let currentTheme: Theme = resolveInitialTheme();

function resolveInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);

  if (stored === 'emerald-lime' || stored === 'emerald-steel' || stored === 'emerald-gold') {
    return stored;
  }

  return 'emerald-lime';
}

function applyDocumentTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

/**
 * Initializes theme on first page load.
 */
export function initTheme(): void {
  applyDocumentTheme(currentTheme);
}

/**
 * Returns the active theme.
 */
export function getTheme(): Theme {
  return currentTheme;
}

/**
 * Persists theme, updates document, and notifies subscribers.
 */
export function setTheme(theme: Theme): void {
  if (theme === currentTheme) {
    return;
  }

  currentTheme = theme;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyDocumentTheme(theme);

  for (const listener of themeListeners) {
    listener();
  }
}

/**
 * Subscribes to theme changes.
 */
export function onThemeChange(listener: () => void): () => void {
  themeListeners.add(listener);

  return () => {
    themeListeners.delete(listener);
  };
}
