import '@/styles/main.scss';
import newsData from '@/data/news.json';
import { cdnUrl } from '@/config/assets';
import { getLocale, getLocalizedList, t, td } from '@/i18n';
import type { Locale, NewsArticle } from '@/types';
import { basePath } from '@/utils/path';
import { initPage } from '@/utils/mountLayout';

const newsArticles = newsData as readonly NewsArticle[];

const LOCALE_DATE_MAP: Record<Locale, string> = {
  en: 'en-US',
  zh: 'zh-CN',
  ru: 'ru-RU',
};

function formatNewsDate(isoDate: string): string {
  return new Intl.DateTimeFormat(LOCALE_DATE_MAP[getLocale()], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${isoDate}T00:00:00`));
}

function renderNewsDetail(): void {
  const main = document.getElementById('page-content');

  if (!main) {
    return;
  }

  const id = new URLSearchParams(window.location.search).get('id');
  const article = newsArticles.find((item) => item.id === id);

  main.replaceChildren(article ? createArticle(article) : createNotFound());
}

function createArticle(article: NewsArticle): HTMLElement {
  const section = document.createElement('article');
  section.className = 'section news-detail';
  const paragraphs = getLocalizedParagraphs(article)
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join('');
  const images = article.images
    .map((image) => `
      <figure>
        <img src="${cdnUrl(image.category, image.filename)}" alt="${td(image, 'alt')}" loading="lazy" />
      </figure>
    `)
    .join('');

  section.innerHTML = `
    <div class="container container--narrow news-detail__container">
      <a class="news-detail__back" href="${basePath('/news/')}">← ${t('news.back')}</a>
      <header class="news-detail__header">
        <p class="news-detail__meta">
          <span>${t(`news.category.${article.category}`)}</span>
          <time datetime="${article.date}">${formatNewsDate(article.date)}</time>
        </p>
        <h1>${td(article, 'title')}</h1>
        <p class="news-detail__excerpt">${td(article, 'excerpt')}</p>
      </header>
      <div class="news-detail__body">${paragraphs}</div>
      <div class="news-detail__gallery">${images}</div>
    </div>
  `;

  return section;
}

function getLocalizedParagraphs(article: NewsArticle): readonly string[] {
  return getLocalizedList(
    article.paragraphs,
    article.paragraphs_zh,
    article.paragraphs_ru,
  );
}

function createNotFound(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section news-detail';
  section.innerHTML = `
    <div class="container container--narrow news-detail__empty">
      <h1>${t('news.notFound.title')}</h1>
      <p>${t('news.notFound.desc')}</p>
      <a class="button button--primary" href="${basePath('/news/')}">${t('news.back')}</a>
    </div>
  `;

  return section;
}

initPage('news', renderNewsDetail);
