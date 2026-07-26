import '@/styles/main.scss';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import industriesData from '@/data/industries.json';
import { t, td } from '@/i18n';
import type { IndustryApplication } from '@/types';
import { getIcon } from '@/utils/icons';
import { initPage } from '@/utils/mountLayout';
import { basePath } from '@/utils/path';

const industries = industriesData as readonly IndustryApplication[];

function renderIndustriesPage(): void {
  const main = document.getElementById('page-content');
  if (!main) return;

  const header = document.createElement('section');
  header.className = 'page-header industries-header';
  header.appendChild(
    createSectionTitle({
      eyebrow: t('industries.eyebrow'),
      title: t('industries.title'),
      description: t('industries.desc'),
    }),
  );

  const overview = document.createElement('section');
  overview.className = 'section industries-overview';
  const overviewContainer = document.createElement('div');
  overviewContainer.className = 'container';
  overviewContainer.append(createStatusNotice(), createOverviewGrid());
  overview.appendChild(overviewContainer);

  const details = document.createElement('div');
  details.className = 'industries-details';
  for (const [index, industry] of industries.entries()) {
    details.appendChild(createIndustryDetail(industry, index));
  }

  main.replaceChildren(header, overview, details);
}

function createStatusNotice(): HTMLElement {
  const notice = document.createElement('aside');
  notice.className = 'industries-status';
  notice.innerHTML = `<strong>${t('industries.status.example')}</strong><span>${t('industries.status.note')}</span>`;
  return notice;
}

function createOverviewGrid(): HTMLElement {
  const grid = document.createElement('nav');
  grid.className = 'industries-grid';
  grid.setAttribute('aria-label', t('industries.overview.label'));

  for (const industry of industries) {
    const card = document.createElement('a');
    card.className = 'industry-card';
    card.href = `#industry-${industry.id}`;
    card.innerHTML = `
      <span class="industry-card__index">${industry.id.toUpperCase().slice(0, 3)}</span>
      <span class="industry-card__icon">${getIcon(industry.icon)}</span>
      <strong class="industry-card__title"></strong>
      <span class="industry-card__summary"></span>
      <span class="industry-card__action">${t('industries.view')} <span aria-hidden="true">↓</span></span>
    `;
    card.querySelector<HTMLElement>('.industry-card__title')!.textContent = td(industry, 'name');
    card.querySelector<HTMLElement>('.industry-card__summary')!.textContent = td(industry, 'summary');
    grid.appendChild(card);
  }

  return grid;
}

function createIndustryDetail(industry: IndustryApplication, index: number): HTMLElement {
  const section = document.createElement('section');
  section.id = `industry-${industry.id}`;
  section.className = `section industry-detail${index % 2 === 1 ? ' section--muted' : ''}`;

  const container = document.createElement('div');
  container.className = 'container industry-detail__layout';

  const heading = document.createElement('div');
  heading.className = 'industry-detail__heading';
  heading.innerHTML = `
    <span class="industry-detail__number">${String(index + 1).padStart(2, '0')}</span>
    <span class="industry-detail__icon">${getIcon(industry.icon)}</span>
    <p class="industry-detail__status"></p>
    <h2 class="industry-detail__title"></h2>
    <p class="industry-detail__summary"></p>
  `;
  heading.querySelector<HTMLElement>('.industry-detail__status')!.textContent =
    industry.status === 'example-placeholder' ? t('industries.status.example') : industry.status;
  heading.querySelector<HTMLElement>('.industry-detail__title')!.textContent = td(industry, 'name');
  heading.querySelector<HTMLElement>('.industry-detail__summary')!.textContent = td(industry, 'summary');

  const body = document.createElement('div');
  body.className = 'industry-detail__body';
  body.append(
    createFact(t('industries.environment'), td(industry, 'environment')),
    createFact(t('industries.challenge'), td(industry, 'challenge')),
    createFact(t('industries.response'), td(industry, 'response')),
    createEquipment(industry),
    createRelatedCases(industry),
  );

  container.append(heading, body);
  section.appendChild(container);
  return section;
}

function createFact(label: string, value: string): HTMLElement {
  const item = document.createElement('section');
  item.className = 'industry-fact';
  const title = document.createElement('h3');
  title.textContent = label;
  const copy = document.createElement('p');
  copy.textContent = value;
  item.append(title, copy);
  return item;
}

function createEquipment(industry: IndustryApplication): HTMLElement {
  const item = document.createElement('section');
  item.className = 'industry-fact industry-fact--links';
  const title = document.createElement('h3');
  title.textContent = t('industries.equipment');
  const list = document.createElement('ul');

  for (const equipment of industry.equipment) {
    const row = document.createElement('li');
    const link = document.createElement('a');
    link.href = basePath(`/products/?id=${equipment.productId}`);
    link.textContent = td(equipment, 'name');
    row.appendChild(link);
    list.appendChild(row);
  }

  item.append(title, list);
  return item;
}

function createRelatedCases(industry: IndustryApplication): HTMLElement {
  const item = document.createElement('section');
  item.className = 'industry-fact industry-fact--cases';
  const heading = document.createElement('div');
  heading.className = 'industry-fact__heading';
  const title = document.createElement('h3');
  title.textContent = t('industries.cases');
  const status = document.createElement('span');
  status.textContent = t('industries.status.example');
  heading.append(title, status);

  const list = document.createElement('ul');
  for (const relatedCase of industry.relatedCases) {
    const row = document.createElement('li');
    const link = document.createElement('a');
    link.href = basePath(`/cases/?id=${relatedCase.id}`);
    link.textContent = td(relatedCase, 'name');
    row.appendChild(link);
    list.appendChild(row);
  }

  item.append(heading, list);
  return item;
}

initPage('industries', renderIndustriesPage);
