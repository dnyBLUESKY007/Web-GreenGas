import '@/styles/main.scss';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { t } from '@/i18n';
import { initPage } from '@/utils/mountLayout';

interface NewsItem {
  readonly id: string;
  readonly date: string;
  readonly titleKey: string;
  readonly excerptKey: string;
}

const PLACEHOLDER_NEWS: readonly NewsItem[] = [
  {
    id: 'product-line-update',
    date: '2026-05-12',
    titleKey: 'news.item1.title',
    excerptKey: 'news.item1.excerpt',
  },
  {
    id: 'team-building',
    date: '2026-04-03',
    titleKey: 'news.item2.title',
    excerptKey: 'news.item2.excerpt',
  },
] as const;

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
  container.className = 'container news-list';

  for (const item of PLACEHOLDER_NEWS) {
    container.appendChild(createNewsCard(item));
  }

  listSection.appendChild(container);
  main.replaceChildren(header, listSection);
}

function createNewsCard(item: NewsItem): HTMLElement {
  const article = document.createElement('article');
  article.className = 'news-card';
  article.innerHTML = `
    <time class="news-card__date" datetime="${item.date}">${item.date}</time>
    <h3 class="news-card__title">${t(item.titleKey)}</h3>
    <p class="news-card__excerpt">${t(item.excerptKey)}</p>
  `;
  return article;
}

initPage('news', renderNewsPage);
