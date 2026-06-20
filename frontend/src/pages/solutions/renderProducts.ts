import productsData from '@/data/products.json';
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
  const article = document.createElement('article');
  article.className = 'solution-card';

  article.innerHTML = `
    <div class="solution-card__media">
      <img
        class="solution-card__image"
        src="${product.image}"
        alt="${product.name}"
        width="400"
        height="280"
        loading="lazy"
      />
    </div>
    <div class="solution-card__body">
      <p class="solution-card__category">${product.category}</p>
      <h3 class="solution-card__title">${product.name}</h3>
      <p class="solution-card__description">${product.description}</p>
    </div>
  `;

  return article;
}
