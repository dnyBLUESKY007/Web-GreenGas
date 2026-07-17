import companyData from '@/data/company.json';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { t, td } from '@/i18n';
import { getIcon } from '@/utils/icons';
import type { CompanyData } from '@/types';

const company = companyData as CompanyData;

export function createServiceStrip(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section section--compact service-strip-section home-screen home-screen--services';

  const container = document.createElement('div');
  container.className = 'container';

  const title = createSectionTitle({
    title: t('home.services.title'),
    description: t('home.services.desc'),
  });

  const strip = document.createElement('div');
  strip.className = 'service-strip';

  for (const service of company.services) {
    const item = document.createElement('div');
    item.className = 'service-strip__item';

    const icon = document.createElement('div');
    icon.className = 'service-strip__icon';
    icon.innerHTML = getIcon(service.icon);

    const label = document.createElement('span');
    label.className = 'service-strip__label';
    label.textContent = td(service, 'label');

    item.append(icon, label);
    strip.appendChild(item);
  }

  container.append(title, strip);
  section.appendChild(container);

  return section;
}
