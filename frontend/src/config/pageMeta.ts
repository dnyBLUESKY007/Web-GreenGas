import { t } from '@/i18n';
import type { PageId, PageMeta } from '@/types';

const DEFAULT_OG_IMAGE = '/images/placeholder.svg';

export const PAGE_META: Record<PageId, PageMeta> = {
  home: {
    titleKey: 'meta.home.title',
    descriptionKey: 'meta.home.description',
    ogTitleKey: 'meta.home.ogTitle',
    ogDescriptionKey: 'meta.home.ogDescription',
    ogImage: DEFAULT_OG_IMAGE,
  },
  solutions: {
    titleKey: 'meta.solutions.title',
    descriptionKey: 'meta.solutions.description',
    ogTitleKey: 'meta.solutions.ogTitle',
    ogDescriptionKey: 'meta.solutions.ogDescription',
    ogImage: DEFAULT_OG_IMAGE,
  },
  about: {
    titleKey: 'meta.about.title',
    descriptionKey: 'meta.about.description',
    ogTitleKey: 'meta.about.ogTitle',
    ogDescriptionKey: 'meta.about.ogDescription',
    ogImage: DEFAULT_OG_IMAGE,
  },
  contact: {
    titleKey: 'meta.contact.title',
    descriptionKey: 'meta.contact.description',
    ogTitleKey: 'meta.contact.ogTitle',
    ogDescriptionKey: 'meta.contact.ogDescription',
    ogImage: DEFAULT_OG_IMAGE,
  },
  news: {
    titleKey: 'meta.news.title',
    descriptionKey: 'meta.news.description',
    ogTitleKey: 'meta.news.ogTitle',
    ogDescriptionKey: 'meta.news.ogDescription',
    ogImage: DEFAULT_OG_IMAGE,
  },
};

export function applyPageMeta(pageId: PageId): void {
  const meta = PAGE_META[pageId];

  document.title = t(meta.titleKey);

  setMetaTag('name', 'description', t(meta.descriptionKey));
  setMetaTag('property', 'og:title', t(meta.ogTitleKey));
  setMetaTag('property', 'og:description', t(meta.ogDescriptionKey));
  setMetaTag('property', 'og:image', meta.ogImage);
  setMetaTag('property', 'og:type', 'website');
}

function setMetaTag(
  attribute: 'name' | 'property',
  key: string,
  content: string,
): void {
  let element = document.querySelector(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}
