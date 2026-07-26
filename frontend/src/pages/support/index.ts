import '@/styles/main.scss';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { CDN_BASE } from '@/config/assets';
import supportDataJson from '@/data/technical-support.json';
import { t, td } from '@/i18n';
import type {
  TechnicalDocument,
  TechnicalDocumentCategory,
  TechnicalDocumentCategoryRecord,
  TechnicalSupportData,
} from '@/types';
import { initPage } from '@/utils/mountLayout';

const supportData = supportDataJson as TechnicalSupportData;
let activeCategory: TechnicalDocumentCategory | 'all' = 'all';

function renderSupportPage(): void {
  const main = document.getElementById('page-content');
  if (!main) return;

  const header = document.createElement('section');
  header.className = 'page-header support-hero';
  header.appendChild(
    createSectionTitle({
      eyebrow: t('support.eyebrow'),
      title: t('support.title'),
      description: t('support.desc'),
    }),
  );

  const library = document.createElement('section');
  library.className = 'section support-library';
  const container = document.createElement('div');
  container.className = 'container';
  container.append(createInventoryNotice(), createCategoryFilter(), createCategorySections());
  library.appendChild(container);

  main.replaceChildren(header, library);
}

function createInventoryNotice(): HTMLElement {
  const notice = document.createElement('p');
  notice.className = 'support-library__notice';
  notice.textContent = t('support.inventoryNotice');
  return notice;
}

function createCategoryFilter(): HTMLElement {
  const filter = document.createElement('div');
  filter.className = 'support-filter';
  filter.setAttribute('role', 'group');
  filter.setAttribute('aria-label', t('support.filter.label'));

  const options: readonly (TechnicalDocumentCategoryRecord | { readonly id: 'all' })[] = [
    { id: 'all' },
    ...supportData.categories,
  ];

  for (const option of options) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'support-filter__button';
    button.dataset.category = option.id;
    button.textContent = option.id === 'all' ? t('support.filter.all') : td(option, 'name');
    button.setAttribute('aria-pressed', String(activeCategory === option.id));
    button.addEventListener('click', () => {
      activeCategory = option.id;
      renderSupportPage();
      focusActiveFilter();
    });
    filter.appendChild(button);
  }

  return filter;
}

function createCategorySections(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'support-categories';
  wrapper.setAttribute('aria-live', 'polite');
  const categories = activeCategory === 'all'
    ? supportData.categories
    : supportData.categories.filter(({ id }) => id === activeCategory);

  for (const category of categories) {
    const section = document.createElement('section');
    section.className = 'support-category';

    const heading = document.createElement('h2');
    heading.className = 'support-category__title';
    heading.textContent = td(category, 'name');
    section.appendChild(heading);

    const categoryDocuments = supportData.documents.filter((item) => item.category === category.id);
    if (categoryDocuments.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'support-category__empty';
      empty.textContent = t('support.empty');
      section.appendChild(empty);
    } else {
      const list = document.createElement('div');
      list.className = 'support-category__documents';
      for (const technicalDocument of categoryDocuments) {
        list.appendChild(createDocumentCard(technicalDocument, category));
      }
      section.appendChild(list);
    }

    wrapper.appendChild(section);
  }

  return wrapper;
}

function createDocumentCard(
  technicalDocument: TechnicalDocument,
  category: TechnicalDocumentCategoryRecord,
): HTMLElement {
  const card = document.createElement('article');
  card.className = 'support-document';

  const heading = document.createElement('div');
  heading.className = 'support-document__heading';
  heading.appendChild(
    createTextElement('h3', 'support-document__title', td(technicalDocument, 'title')),
  );

  if (technicalDocument.contentStatus === 'example-placeholder') {
    heading.appendChild(createTextElement('span', 'support-document__badge', t('support.example')));
  }

  const metadata = document.createElement('dl');
  metadata.className = 'support-document__metadata';
  appendMetadata(metadata, t('support.meta.category'), td(category, 'name'));
  appendMetadata(metadata, t('support.meta.product'), td(technicalDocument, 'relatedProduct'));
  appendMetadata(metadata, t('support.meta.language'), td(technicalDocument, 'language'));
  appendMetadata(metadata, t('support.meta.fileType'), technicalDocument.fileType);
  appendMetadata(metadata, t('support.meta.versionOrDate'), td(technicalDocument, 'versionOrDate'));

  card.append(heading, metadata, createDownloadAction(technicalDocument));
  return card;
}

function appendMetadata(list: HTMLDListElement, label: string, value: string): void {
  list.append(
    createTextElement('dt', 'support-document__label', label),
    createTextElement('dd', 'support-document__value', value),
  );
}

function createDownloadAction(technicalDocument: TechnicalDocument): HTMLElement {
  if (isDownloadReady(technicalDocument)) {
    const link = createTextElement('a', 'support-document__download', t('support.download'));
    link.setAttribute('href', technicalDocument.downloadUrl);
    link.setAttribute('aria-label', `${t('support.download')}: ${td(technicalDocument, 'title')}`);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    return link;
  }

  const unavailable = createTextElement(
    'span',
    'support-document__download support-document__download--unavailable',
    t('support.unavailable'),
  );
  unavailable.setAttribute('aria-disabled', 'true');
  return unavailable;
}

function isDownloadReady(
  technicalDocument: TechnicalDocument,
): technicalDocument is TechnicalDocument & { downloadUrl: string } {
  if (
    technicalDocument.publicationStatus !== 'approved'
    || technicalDocument.availabilityStatus !== 'verified'
    || !technicalDocument.downloadUrl
  ) {
    return false;
  }

  try {
    const url = new URL(technicalDocument.downloadUrl);
    return url.protocol === 'https:' && url.hostname === new URL(CDN_BASE).hostname;
  } catch {
    return false;
  }
}

function focusActiveFilter(): void {
  document.querySelector<HTMLButtonElement>(
    `.support-filter__button[data-category="${activeCategory}"]`,
  )?.focus();
}

function createTextElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className: string,
  text: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

initPage('support', renderSupportPage);
