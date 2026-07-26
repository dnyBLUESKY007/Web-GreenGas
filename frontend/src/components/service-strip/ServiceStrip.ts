import companyData from '@/data/company.json';
import supportDataJson from '@/data/technical-support.json';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { t, td } from '@/i18n';
import { getIcon } from '@/utils/icons';
import type { CompanyData, TechnicalSupportData } from '@/types';
import { basePath } from '@/utils/path';

const company = companyData as CompanyData;
const supportData = supportDataJson as TechnicalSupportData;

export function createServiceStrip(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section section--compact service-strip-section';

  const container = document.createElement('div');
  container.className = 'container';

  const head = document.createElement('div');
  head.className = 'section-head';
  const title = createSectionTitle({
    title: t('home.support.title'),
    description: t('home.support.desc'),
  });
  const moreLink = document.createElement('a');
  moreLink.className = 'section-head__action';
  moreLink.href = basePath('/support/');
  moreLink.textContent = `${t('home.support.more')} →`;
  head.append(title, moreLink);

  const supportSummary = document.createElement('aside');
  supportSummary.className = 'support-preview';
  const sampleDocument = supportData.documents[0];
  if (sampleDocument) {
    const title = document.createElement('strong');
    title.textContent = td(sampleDocument, 'title');
    const statuses = document.createElement('span');
    statuses.textContent = [
      sampleDocument.contentStatus === 'example-placeholder' ? t('support.example') : sampleDocument.contentStatus,
      sampleDocument.publicationStatus === 'unavailable' ? t('support.unavailable') : sampleDocument.publicationStatus,
    ].join(' · ');
    const notice = document.createElement('p');
    notice.textContent = t('support.inventoryNotice');
    supportSummary.append(title, statuses, notice);
  }

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

  container.append(head, supportSummary, strip);
  section.appendChild(container);

  return section;
}
