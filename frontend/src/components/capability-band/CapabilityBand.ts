import companyData from '@/data/company.json';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { t, td } from '@/i18n';
import { getIcon } from '@/utils/icons';
import type { CompanyData } from '@/types';

const company = companyData as CompanyData;

export function createCapabilityBand(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section section--dark capability-band';

  const container = document.createElement('div');
  container.className = 'container capability-band__inner';

  const header = createSectionTitle({
    eyebrow: t('home.capabilities.eyebrow'),
    title: t('home.capabilities.title'),
    description: t('home.capabilities.desc'),
  });
  header.classList.add('capability-band__header');

  const content = document.createElement('div');
  content.className = 'capability-band__content';

  const statsCol = document.createElement('div');
  statsCol.className = 'capability-band__stats';

  for (const stat of company.stats) {
    const item = document.createElement('div');
    item.className = 'capability-band__stat';
    item.innerHTML = `
      <p class="capability-band__stat-value">${stat.value}</p>
      <p class="capability-band__stat-label">${td(stat, 'label')}</p>
    `;
    statsCol.appendChild(item);
  }

  const listCol = document.createElement('div');
  listCol.className = 'capability-band__list';

  for (const cap of company.capabilities) {
    const item = document.createElement('article');
    item.className = 'capability-band__item';

    const icon = document.createElement('div');
    icon.className = 'capability-band__item-icon';
    icon.innerHTML = getIcon(cap.icon);

    const body = document.createElement('div');
    body.className = 'capability-band__item-body';

    const title = document.createElement('h3');
    title.className = 'capability-band__item-title';
    title.textContent = td(cap, 'title');

    const desc = document.createElement('p');
    desc.className = 'capability-band__item-desc';
    desc.textContent = td(cap, 'desc');

    body.append(title, desc);
    item.append(icon, body);
    listCol.appendChild(item);
  }

  content.append(statsCol, listCol);
  container.append(header, content);
  section.appendChild(container);

  return section;
}
