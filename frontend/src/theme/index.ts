import type { Theme } from '@/types';

/** Canonical brand theme (emerald primary + lime accent). UI switcher removed — see issue-0002. */
const CANONICAL_THEME: Theme = 'emerald-lime';

const themeListeners = new Set<() => void>();

let currentTheme: Theme = CANONICAL_THEME;

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
