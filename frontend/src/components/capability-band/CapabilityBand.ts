import companyData from '@/data/company.json';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { cdnUrl } from '@/config/assets';
import { t, td } from '@/i18n';
import { getIcon } from '@/utils/icons';
import type { CompanyData } from '@/types';

const company = companyData as CompanyData;
const STAT_ICONS = ['factory', 'award', 'headset'] as const;

export function createCapabilityBand(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section capability-band home-screen home-screen--capability';
  section.style.setProperty(
    '--capability-band-bg',
    `url("${cdnUrl('capacity', 'background.webp')}")`,
  );

  const container = document.createElement('div');
  container.className = 'container capability-band__inner';

  const header = createSectionTitle({
    eyebrow: t('home.capabilities.eyebrow'),
    title: t('home.capabilities.title'),
    description: t('home.capabilities.desc'),
  });
  header.classList.add('capability-band__header');

  const stats = document.createElement('div');
  stats.className = 'capability-stats';

  for (const stat of company.stats) {
    const item = document.createElement('div');
    item.className = 'capability-stats__item';

    const icon = document.createElement('div');
    icon.className = 'capability-stats__icon';
    icon.innerHTML = getIcon(STAT_ICONS[company.stats.indexOf(stat)] ?? 'factory');

    const content = document.createElement('div');
    content.className = 'capability-stats__content';

    const value = document.createElement('p');
    value.className = 'capability-stats__value';
    value.textContent = stat.value;

    const label = document.createElement('p');
    label.className = 'capability-stats__label';
    label.textContent = td(stat, 'label');

    content.append(value, label);
    item.append(icon, content);
    stats.appendChild(item);
  }

  const process = document.createElement('div');
  process.className = 'capability-process';

  company.workflow.forEach((step, index) => {
    const article = document.createElement('article');
    article.className = 'capability-process__card';

    const body = document.createElement('div');
    body.className = 'capability-process__card-body';

    const number = document.createElement('p');
    number.className = 'capability-process__number';
    number.textContent = String(index + 1).padStart(2, '0');

    const icon = document.createElement('div');
    icon.className = 'capability-process__icon';
    icon.innerHTML = getIcon(step.icon);

    const stepTitle = td(step, 'title');

    const title = document.createElement('h3');
    title.className = 'capability-process__title';
    title.textContent = stepTitle;

    const desc = document.createElement('p');
    desc.className = 'capability-process__desc';
    desc.textContent = td(step, 'desc');

    const media = document.createElement('div');
    media.className = 'capability-process__media';

    const img = document.createElement('img');
    img.className = 'capability-process__image';
    img.src = cdnUrl('capacity', `${index + 1}.webp`);
    img.alt = stepTitle;
    img.loading = 'lazy';
    img.decoding = 'async';

    media.appendChild(img);
    body.append(number, icon, title, desc);
    article.append(body, media);
    process.appendChild(article);
  });

  container.append(header, stats, process);
  section.appendChild(container);

  return section;
}
