import '@/styles/main.scss';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { getLocale, t } from '@/i18n';
import type { Locale } from '@/types';
import { initPage } from '@/utils/mountLayout';
import { cdnUrl } from '@/config/assets';

const DEFAULT_NEWS_IMAGE = cdnUrl('company-info', 'team-photo.webp');

const LOCALE_DATE_MAP: Record<Locale, string> = {
  en: 'en-US',
  zh: 'zh-CN',
  ru: 'ru-RU',
};

interface NewsItem {
  readonly id: string;
  readonly date: string;
  readonly titleKey: string;
  readonly excerptKey: string;
  readonly image: string;
}

const PLACEHOLDER_NEWS: readonly NewsItem[] = [
  {
    id: 'product-line-update',
    date: '2026-05-12',
    titleKey: 'news.item1.title',
    excerptKey: 'news.item1.excerpt',
    image: DEFAULT_NEWS_IMAGE,
  },
  {
    id: 'team-building',
    date: '2026-04-03',
    titleKey: 'news.item2.title',
    excerptKey: 'news.item2.excerpt',
    image: DEFAULT_NEWS_IMAGE,
  },
] as const;

function formatNewsDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);

  return new Intl.DateTimeFormat(LOCALE_DATE_MAP[getLocale()], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function renderNewsPage(): void {
  const main = document.getElementById('page-content');

  if (!main) {
    return;
  }

  const header = document.createElement('section');
  header.className = 'page-header';
  header.appendChild(
    createSectionTitle({
      eyebrow: t('news.eyebrow'),
      title: t('news.title'),
      description: t('news.desc'),
    }),
  );

  const listSection = document.createElement('section');
  listSection.className = 'section';
  const container = document.createElement('div');
  container.className = 'container container--narrow news-list';

  for (const item of PLACEHOLDER_NEWS) {
    container.appendChild(createNewsCard(item));
  }

  listSection.appendChild(container);
  main.replaceChildren(header, listSection);
}

function createNewsCard(item: NewsItem): HTMLElement {
  const title = t(item.titleKey);
  const article = document.createElement('article');
  article.className = 'news-card';
  article.innerHTML = `
    <div class="news-card__media">
      <img class="news-card__image" src="${item.image}" alt="${title}" loading="lazy" />
    </div>
    <div class="news-card__body">
      <time class="news-card__date" datetime="${item.date}">${formatNewsDate(item.date)}</time>
      <h3 class="news-card__title">${title}</h3>
      <p class="news-card__excerpt">${t(item.excerptKey)}</p>
    </div>
  `;
  return article;
}

initPage('news', renderNewsPage);
