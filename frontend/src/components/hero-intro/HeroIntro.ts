import { t } from '@/i18n';

export function createHeroIntro(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'hero-intro';

  const inner = document.createElement('div');
  inner.className = 'hero-intro__inner container';

  const text = document.createElement('p');
  text.className = 'hero-intro__text';
  text.textContent = t('home.heroIntro.text');

  inner.appendChild(text);
  section.appendChild(inner);

  return section;
}
