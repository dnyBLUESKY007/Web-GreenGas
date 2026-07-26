import companyData from '@/data/company.json';
import { getLocalizedList } from '@/i18n';
import type { CompanyData } from '@/types';

const company = companyData as CompanyData;

export function createHeroIntro(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'hero-intro';

  const inner = document.createElement('div');
  inner.className = 'hero-intro__inner container';

  const text = document.createElement('p');
  text.className = 'hero-intro__text';
  const profile = company.profile;
  const paragraphs = getLocalizedList(
    profile.paragraphs,
    profile.paragraphs_zh,
    profile.paragraphs_ru,
  );
  text.textContent = paragraphs[0] ?? '';

  inner.appendChild(text);
  section.appendChild(inner);

  return section;
}
