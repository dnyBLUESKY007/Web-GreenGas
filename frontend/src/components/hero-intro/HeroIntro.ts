import companyData from '@/data/company.json';
import { getLocale } from '@/i18n';
import type { CompanyData } from '@/types';

const company = companyData as CompanyData;

export function createHeroIntro(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'hero-intro';

  const inner = document.createElement('div');
  inner.className = 'hero-intro__inner container';

  const text = document.createElement('p');
  text.className = 'hero-intro__text';
  const locale = getLocale();
  const localizedParagraphs = locale === 'zh'
    ? company.profile.paragraphs_zh
    : locale === 'ru'
      ? company.profile.paragraphs_ru
      : company.profile.paragraphs;
  const paragraphs = localizedParagraphs ?? company.profile.paragraphs;
  text.textContent = paragraphs[0] ?? '';

  inner.appendChild(text);
  section.appendChild(inner);

  return section;
}
