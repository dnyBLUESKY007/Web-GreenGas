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
  const category = td(product, 'category');
  const description = td(product, 'description');

  const article = document.createElement('article');
  article.className = 'solution-card';

  article.innerHTML = `
    <div class="solution-card__media">
      <img
        class="solution-card__image"
        src="${product.image}"
        alt="${name}"
        width="400"
        height="280"
        loading="lazy"
      />
    </div>
    <div class="solution-card__body">
      <p class="solution-card__category">${category}</p>
      <h3 class="solution-card__title">${name}</h3>
      <p class="solution-card__description">${description}</p>
    </div>
  `;

  return article;
}
