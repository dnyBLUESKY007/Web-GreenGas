import '@/styles/main.scss';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
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
const OSS_HOST_PATTERN = /\.oss-[a-z0-9-]+\.aliyuncs\.com$/;
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
      for (const item of categoryDocuments) {
        list.appendChild(createDocumentCard(item, category));
      }
      section.appendChild(list);
    }

    wrapper.appendChild(section);
  }

  return wrapper;
}

function createDocumentCard(
  item: TechnicalDocument,
  category: TechnicalDocumentCategoryRecord,
): HTMLElement {
  const card = document.createElement('article');
  card.className = 'support-document';

  const heading = document.createElement('div');
  heading.className = 'support-document__heading';
  const title = documentElement('h3', 'support-document__title', td(item, 'title'));
  heading.appendChild(title);

  if (item.contentStatus === 'example-placeholder') {
    heading.appendChild(documentElement('span', 'support-document__badge', t('support.example')));
  }

  const metadata = document.createElement('dl');
  metadata.className = 'support-document__metadata';
  appendMetadata(metadata, t('support.meta.category'), td(category, 'name'));
  appendMetadata(metadata, t('support.meta.product'), td(item, 'relatedProduct'));
  appendMetadata(metadata, t('support.meta.language'), td(item, 'language'));
  appendMetadata(metadata, t('support.meta.fileType'), item.fileType);
  appendMetadata(metadata, t('support.meta.versionOrDate'), td(item, 'versionOrDate'));

  card.append(heading, metadata, createDownloadAction(item));
  return card;
}

function appendMetadata(list: HTMLDListElement, label: string, value: string): void {
  list.append(
    documentElement('dt', 'support-document__label', label),
    documentElement('dd', 'support-document__value', value),
  );
}

function createDownloadAction(document: TechnicalDocument): HTMLElement {
  if (isDownloadReady(document)) {
    const link = documentElement('a', 'support-document__download', t('support.download'));
    link.setAttribute('href', document.downloadUrl);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    return link;
  }

  const unavailable = documentElement(
    'span',
    'support-document__download support-document__download--unavailable',
    t('support.unavailable'),
  );
  unavailable.setAttribute('aria-disabled', 'true');
  return unavailable;
}

function isDownloadReady(document: TechnicalDocument): document is TechnicalDocument & { downloadUrl: string } {
  if (
    document.publicationStatus !== 'approved'
    || document.availabilityStatus !== 'verified'
    || !document.downloadUrl
  ) return false;

  try {
    const url = new URL(document.downloadUrl);
    return url.protocol === 'https:' && OSS_HOST_PATTERN.test(url.hostname);
  } catch {
    return false;
  }
}

function focusActiveFilter(): void {
  document.querySelector<HTMLButtonElement>(
    `.support-filter__button[data-category="${activeCategory}"]`,
  )?.focus();
}

function documentElement<K extends keyof HTMLElementTagNameMap>(
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
