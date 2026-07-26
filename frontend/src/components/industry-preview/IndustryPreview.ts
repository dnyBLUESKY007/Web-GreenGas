import { createSectionTitle } from '@/components/section-title/SectionTitle';
import industriesData from '@/data/industries.json';
import { t, td } from '@/i18n';
import type { IndustryApplication } from '@/types';
import { getIcon } from '@/utils/icons';
import { basePath } from '@/utils/path';

const industries = industriesData as readonly IndustryApplication[];

export function createIndustryPreview(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section home-preview home-industry-preview';

  const container = document.createElement('div');
  container.className = 'container';
  const head = document.createElement('div');
  head.className = 'section-head';
  const title = createSectionTitle({
    title: t('home.industries.title'),
    description: t('home.industries.desc'),
  });
  const moreLink = document.createElement('a');
  moreLink.className = 'section-head__action';
  moreLink.href = basePath('/industries/');
  moreLink.textContent = `${t('home.industries.more')} →`;
  head.append(title, moreLink);

  const grid = document.createElement('div');
  grid.className = 'home-industry-grid';
  for (const industry of industries) {
    const card = document.createElement('a');
    card.className = 'home-industry-card';
    card.href = `${basePath('/industries/')}#industry-${encodeURIComponent(industry.id)}`;
    const icon = document.createElement('span');
    icon.className = 'home-industry-card__icon';
    icon.innerHTML = getIcon(industry.icon);
    const status = document.createElement('span');
    status.className = 'home-preview__status';
    status.textContent = industry.status === 'example-placeholder'
      ? t('industries.status.example')
      : industry.status;
    const name = document.createElement('strong');
    name.className = 'home-industry-card__title';
    name.textContent = td(industry, 'name');
    const summary = document.createElement('span');
    summary.className = 'home-industry-card__summary';
    summary.textContent = td(industry, 'summary');
    card.append(icon, status, name, summary);
    grid.appendChild(card);
  }

  container.append(head, grid);
  section.appendChild(container);
  return section;
}
