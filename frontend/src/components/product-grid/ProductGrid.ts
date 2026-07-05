import productsData from '@/data/products.json';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { t, td } from '@/i18n';
import { basePath } from '@/utils/path';
import type { Product } from '@/types';

const HOME_PRODUCT_COUNT = 6;

export function createProductGrid(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section section--muted product-grid-section';

  const container = document.createElement('div');
  container.className = 'container';

  const head = document.createElement('div');
  head.className = 'section-head';

  const title = createSectionTitle({
    eyebrow: t('home.products.eyebrow'),
    title: t('home.products.title'),
    description: t('home.products.desc'),
  });

  const moreLink = document.createElement('a');
  moreLink.className = 'section-head__action';
  moreLink.href = basePath('/solutions/');
  moreLink.textContent = `${t('home.products.more')} →`;

  head.append(title, moreLink);

  const grid = document.createElement('div');
  grid.className = 'product-grid';

  const products = (productsData as readonly Product[]).slice(0, HOME_PRODUCT_COUNT);

  for (const product of products) {
    grid.appendChild(createProductCard(product));
  }

  container.append(head, grid);
  section.appendChild(container);

  return section;
}

function createProductCard(product: Product): HTMLElement {
  const name = td(product, 'name');
  const description = td(product, 'description');

  const article = document.createElement('article');
  article.className = 'product-grid-card';

  article.innerHTML = `
    <div class="product-grid-card__media">
      <img
        class="product-grid-card__image"
        src="${product.image}"
        alt="${name}"
        width="320"
        height="240"
        loading="lazy"
      />
    </div>
    <div class="product-grid-card__body">
      <h3 class="product-grid-card__name">${name}</h3>
      <p class="product-grid-card__desc">${description}</p>
    </div>
  `;

  return article;
}
