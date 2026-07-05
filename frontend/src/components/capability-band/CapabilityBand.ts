import companyData from '@/data/company.json';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { t, td } from '@/i18n';
import { getIcon } from '@/utils/icons';
import type { CompanyData } from '@/types';

const company = companyData as CompanyData;

const WORKFLOW_POSITIONS = [
  'capability-ring__step--top',
  'capability-ring__step--right',
  'capability-ring__step--bottom-right',
  'capability-ring__step--bottom-left',
  'capability-ring__step--left',
] as const;

export function createCapabilityBand(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section section--dark capability-band home-screen home-screen--capability';

  const container = document.createElement('div');
  container.className = 'container capability-band__inner';

  const header = createSectionTitle({
    eyebrow: t('home.capabilities.eyebrow'),
    title: t('home.capabilities.title'),
    description: t('home.capabilities.desc'),
  });
  header.classList.add('capability-band__header');

  const ring = document.createElement('div');
  ring.className = 'capability-ring';

  const center = document.createElement('div');
  center.className = 'capability-ring__center';

  for (const stat of company.stats) {
    const item = document.createElement('div');
    item.className = 'capability-ring__stat';
    item.innerHTML = `
      <p class="capability-ring__stat-value">${stat.value}</p>
      <p class="capability-ring__stat-label">${td(stat, 'label')}</p>
    `;
    center.appendChild(item);
  }

  const stepsWrap = document.createElement('div');
  stepsWrap.className = 'capability-ring__steps';

  company.workflow.forEach((step, index) => {
    const positionClass = WORKFLOW_POSITIONS[index] ?? WORKFLOW_POSITIONS[0];
    const article = document.createElement('article');
    article.className = `capability-ring__step ${positionClass}`;

    const icon = document.createElement('div');
    icon.className = 'capability-ring__step-icon';
    icon.innerHTML = getIcon(step.icon);

    const body = document.createElement('div');
    body.className = 'capability-ring__step-body';

    const title = document.createElement('h3');
    title.className = 'capability-ring__step-title';
    title.textContent = td(step, 'title');

    const desc = document.createElement('p');
    desc.className = 'capability-ring__step-desc';
    desc.textContent = td(step, 'desc');

    body.append(title, desc);
    article.append(icon, body);
    stepsWrap.appendChild(article);
  });

  ring.append(center, stepsWrap);
  container.append(header, ring);
  section.appendChild(container);

  return section;
}
