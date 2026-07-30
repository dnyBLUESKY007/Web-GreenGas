import '@/styles/main.scss';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import newsData from '@/data/news.json';
import { getLocale, t, td } from '@/i18n';
import type { Locale, NewsArticle, NewsCategory } from '@/types';
import { initPage } from '@/utils/mountLayout';
import { cdnUrl, setPageHeaderBackground } from '@/config/assets';
import { basePath } from '@/utils/path';

const newsArticles = newsData as readonly NewsArticle[];

const LOCALE_DATE_MAP: Record<Locale, string> = {
  en: 'en-US',
  zh: 'zh-CN',
  ru: 'ru-RU',
};

let activeCategory: NewsCategory | 'all' = 'all';

function formatNewsDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);

  return new Intl.DateTimeFormat(LOCALE_DATE_MAP[getLocale()], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function renderNewsPage(): void {
  const main = document.getElementById('page-content');

  if (!main) {
    return;
  }

  const header = document.createElement('section');
  header.className = 'page-header';
  setPageHeaderBackground(header, '03_news.webp');
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

  container.appendChild(createCategoryFilter());

  const articles = document.createElement('div');
  articles.className = 'news-list__items';
  const filteredArticles = activeCategory === 'all'
    ? newsArticles
    : newsArticles.filter((article) => article.category === activeCategory);

  for (const item of filteredArticles) {
    articles.appendChild(createNewsCard(item));
  }

  container.appendChild(articles);
  listSection.appendChild(container);
  main.replaceChildren(header, listSection);
}

function createCategoryFilter(): HTMLElement {
  const filter = document.createElement('div');
  filter.className = 'news-filter';
  const categories: readonly (NewsCategory | 'all')[] = ['all', 'company', 'industry'];

  for (const category of categories) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'news-filter__button';
    button.textContent = t(`news.category.${category}`);
    button.setAttribute('aria-pressed', String(activeCategory === category));
    button.addEventListener('click', () => {
      activeCategory = category;
      renderNewsPage();
    });
    filter.appendChild(button);
  }

  return filter;
}

function createNewsCard(item: NewsArticle): HTMLElement {
  const article = document.createElement('article');
  article.className = 'news-card';
  const image = item.featuredImage ?? item.images[0];
  const link = document.createElement('a');
  link.className = 'news-card__link';
  link.href = `${basePath('/news/detail/')}?id=${encodeURIComponent(item.id)}`;
  link.innerHTML = `
    <div class="news-card__media">
      <img class="news-card__image" src="${cdnUrl(image.category, image.filename)}" alt="${td(image, 'alt')}" loading="lazy" />
    </div>
    <div class="news-card__body">
      <time class="news-card__date" datetime="${item.date}">${formatNewsDate(item.date)}</time>
      <p class="news-card__category">${t(`news.category.${item.category}`)}</p>
      <h3 class="news-card__title">${td(item, 'title')}</h3>
      <p class="news-card__excerpt">${td(item, 'excerpt')}</p>
      <span class="news-card__more">${t('news.readMore')}</span>
    </div>
  `;
  article.appendChild(link);

  return article;
}

initPage('news', renderNewsPage);
