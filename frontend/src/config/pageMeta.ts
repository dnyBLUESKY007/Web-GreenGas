import { t } from '@/i18n';
import type { PageId, PageMeta } from '@/types';
import { cdnUrl } from '@/config/assets';

const DEFAULT_OG_IMAGE = cdnUrl('company', 'company-exterior-photo-beautify.webp');
const BRAND_TITLE = 'GREENGAS 格灵空调';

export const PAGE_META: Record<PageId, PageMeta> = {
  home: {
    descriptionKey: 'meta.home.description',
    ogTitleKey: 'meta.home.ogTitle',
    ogDescriptionKey: 'meta.home.ogDescription',
    ogImage: DEFAULT_OG_IMAGE,
  },
  products: {
    descriptionKey: 'meta.solutions.description',
    ogTitleKey: 'meta.solutions.ogTitle',
    ogDescriptionKey: 'meta.solutions.ogDescription',
    ogImage: DEFAULT_OG_IMAGE,
  },
  industries: {
    descriptionKey: 'destination.industries.desc',
    ogTitleKey: 'destination.industries.title',
    ogDescriptionKey: 'destination.industries.desc',
    ogImage: DEFAULT_OG_IMAGE,
  },
  support: {
    descriptionKey: 'destination.support.desc',
    ogTitleKey: 'destination.support.title',
    ogDescriptionKey: 'destination.support.desc',
    ogImage: DEFAULT_OG_IMAGE,
  },
  cases: {
    descriptionKey: 'destination.cases.desc',
    ogTitleKey: 'destination.cases.title',
    ogDescriptionKey: 'destination.cases.desc',
    ogImage: DEFAULT_OG_IMAGE,
  },
  about: {
    descriptionKey: 'meta.about.description',
    ogTitleKey: 'meta.about.ogTitle',
    ogDescriptionKey: 'meta.about.ogDescription',
    ogImage: DEFAULT_OG_IMAGE,
  },
  contact: {
    descriptionKey: 'meta.contact.description',
    ogTitleKey: 'meta.contact.ogTitle',
    ogDescriptionKey: 'meta.contact.ogDescription',
    ogImage: DEFAULT_OG_IMAGE,
  },
  news: {
    descriptionKey: 'meta.news.description',
    ogTitleKey: 'meta.news.ogTitle',
    ogDescriptionKey: 'meta.news.ogDescription',
    ogImage: DEFAULT_OG_IMAGE,
  },
};

export function applyPageMeta(pageId: PageId): void {
  const meta = PAGE_META[pageId];

  document.title = BRAND_TITLE;

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
