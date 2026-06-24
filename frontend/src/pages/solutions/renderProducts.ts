import productsData from '@/data/products.json';
import { td } from '@/i18n';
import type { Product } from '@/types';

export function renderProducts(container: HTMLElement): void {
  const products = productsData as readonly Product[];
  const grid = document.createElement('div');
  grid.className = 'grid grid--solutions';

  for (const product of products) {
    grid.appendChild(createProductCard(product));
  }

  container.replaceChildren(grid);
}

function createProductCard(product: Product): HTMLElement {
  const name = td(product, 'name');
  const category = product.category ? td(product, 'category') : '';
  const description = product.description ? td(product, 'description') : '';

  const article = document.createElement('article');
  article.className = 'solution-card';

  const media = document.createElement('div');
  media.className = 'solution-card__media';
  media.innerHTML = `
    <img
      class="solution-card__image"
      src="${product.image}"
      alt="${name}"
      width="400"
      height="280"
      loading="lazy"
    />
  `;

  const body = document.createElement('div');
  body.className = 'solution-card__body';

  if (category) {
    const categoryEl = document.createElement('p');
    categoryEl.className = 'solution-card__category';
    categoryEl.textContent = category;
    body.appendChild(categoryEl);
  }

  const title = document.createElement('h3');
  title.className = 'solution-card__title';
  title.textContent = name;
  body.appendChild(title);

  if (description) {
    const descEl = document.createElement('p');
    descEl.className = 'solution-card__description';
    descEl.textContent = description;
    body.appendChild(descEl);
  }

  article.append(media, body);

  return article;
}
