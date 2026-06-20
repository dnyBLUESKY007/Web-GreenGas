import '@/styles/main.scss';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { mountLayout } from '@/utils/mountLayout';

interface NewsItem {
  readonly id: string;
  readonly date: string;
  readonly title: string;
  readonly excerpt: string;
}

const PLACEHOLDER_NEWS: readonly NewsItem[] = [
  {
    id: 'product-line-update',
    date: '2026-05-12',
    title: 'New High-Temperature Chiller Series Released',
    excerpt: 'Expanded capacity range for foundry and process cooling applications.',
  },
  {
    id: 'team-building',
    date: '2026-04-03',
    title: 'Engineering Team Site Visit',
    excerpt: 'Field training session with installation crews at a marine project site.',
  },
];

function renderNewsPage(): void {
  const main = document.getElementById('page-content');

  if (!main) {
    return;
  }

  const header = document.createElement('section');
  header.className = 'page-header';
  header.appendChild(
    createSectionTitle({
      eyebrow: 'News',
      title: 'Updates & Announcements',
      description: 'Product releases, project milestones, and company news.',
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
    <h3 class="news-card__title">${item.title}</h3>
    <p class="news-card__excerpt">${item.excerpt}</p>
  `;
  return article;
}

mountLayout('news');
renderNewsPage();
