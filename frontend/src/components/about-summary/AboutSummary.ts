import companyData from '@/data/company.json';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { t, td } from '@/i18n';
import { getIcon } from '@/utils/icons';
import { basePath } from '@/utils/path';
import type { CompanyData } from '@/types';

const company = companyData as CompanyData;

export function createAboutSummary(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section section--muted about-summary-section';

  const container = document.createElement('div');
  container.className = 'container';

  const title = createSectionTitle({
    eyebrow: t('home.about.eyebrow'),
    title: t('home.about.title'),
    description: t('home.about.desc'),
  });

  const grid = document.createElement('div');
  grid.className = 'about-summary';

  const textCol = document.createElement('div');
  textCol.className = 'about-summary__text';

  const desc = document.createElement('p');
  desc.className = 'about-summary__description';
  desc.textContent = td(company, 'description');

  const moreLink = document.createElement('a');
  moreLink.className = 'about-summary__link';
  moreLink.href = basePath('/about/');
  moreLink.textContent = `${t('home.about.more')} →`;

  textCol.append(desc, moreLink);

  const badgesCol = document.createElement('div');
  badgesCol.className = 'about-summary__badges';

  for (const highlight of company.aboutHighlights) {
    const badge = document.createElement('a');
    badge.className = 'about-summary__badge';
    badge.href = basePath('/about/');

    const icon = document.createElement('div');
    icon.className = 'about-summary__badge-icon';
    icon.innerHTML = getIcon(highlight.icon);

    const label = document.createElement('span');
    label.className = 'about-summary__badge-label';
    label.textContent = td(highlight, 'label');

    badge.append(icon, label);
    badgesCol.appendChild(badge);
  }

  grid.append(textCol, badgesCol);
  container.append(title, grid);
  section.appendChild(container);

  return section;
}
