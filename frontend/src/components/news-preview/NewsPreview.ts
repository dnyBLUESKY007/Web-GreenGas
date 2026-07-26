import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { cdnUrl } from '@/config/assets';
import newsData from '@/data/news.json';
import { getLocale, t, td } from '@/i18n';
import type { Locale, NewsArticle } from '@/types';
import { basePath } from '@/utils/path';

const newsArticles = newsData as readonly NewsArticle[];
const localeDates: Record<Locale, string> = { en: 'en-US', zh: 'zh-CN', ru: 'ru-RU' };

export function createNewsPreview(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section section--muted home-preview home-news-preview';
  const container = document.createElement('div');
  container.className = 'container';
  const head = document.createElement('div');
  head.className = 'section-head';
  const title = createSectionTitle({
    title: t('home.news.title'),
    description: t('home.news.desc'),
  });
  const moreLink = document.createElement('a');
  moreLink.className = 'section-head__action';
  moreLink.href = basePath('/news/');
  moreLink.textContent = `${t('home.news.more')} →`;
  head.append(title, moreLink);

  const grid = document.createElement('div');
  grid.className = 'home-news-grid';
  const featuredArticles = newsArticles.filter((article) => article.featured);
  for (const [index, article] of featuredArticles.entries()) {
    grid.appendChild(createNewsCard(article, index === 0));
  }
  container.append(head, grid);
  section.appendChild(container);
  return section;
}

function createNewsCard(article: NewsArticle, featured: boolean): HTMLElement {
  const card = document.createElement('article');
  card.className = `home-news-card${featured ? ' home-news-card--featured' : ''}`;
  const link = document.createElement('a');
  link.className = 'home-news-card__link';
  link.href = `${basePath('/news/detail/')}?id=${encodeURIComponent(article.id)}`;
  const imageData = article.images[0];
  const image = document.createElement('img');
  image.className = 'home-news-card__image';
  image.src = cdnUrl(imageData.category, imageData.filename);
  image.alt = td(imageData, 'alt');
  image.loading = 'lazy';
  const body = document.createElement('div');
  body.className = 'home-news-card__body';
  const meta = document.createElement('p');
  meta.className = 'home-news-card__meta';
  const date = new Intl.DateTimeFormat(localeDates[getLocale()], {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(new Date(`${article.date}T00:00:00`));
  meta.textContent = `${date} · ${t(`news.category.${article.category}`)}`;
  const title = document.createElement('h3');
  title.className = 'home-news-card__title';
  title.textContent = td(article, 'title');
  const excerpt = document.createElement('p');
  excerpt.className = 'home-news-card__excerpt';
  excerpt.textContent = td(article, 'excerpt');
  body.append(meta, title, excerpt);
  link.append(image, body);
  card.appendChild(link);
  return card;
}
