import productsData from '@/data/products.json';
import seriesData from '@/data/product-series.json';
import { td } from '@/i18n';
import type { Product, ProductSeries } from '@/types';

const SERIES_ORDER: readonly ProductSeries['id'][] = [
  'industrial',
  'central-host',
  'commercial-terminal',
  'custom',
];

export function renderProducts(container: HTMLElement): void {
  const products = productsData as readonly Product[];
  const seriesById = new Map((seriesData as readonly ProductSeries[]).map((item) => [item.id, item]));
  const series = SERIES_ORDER.flatMap((id) => {
    const item = seriesById.get(id);
    return item ? [item] : [];
  });
  const tabList = document.createElement('div');
  tabList.className = 'product-series__tabs';
  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-label', 'Product series');

  const panel = document.createElement('div');
  panel.className = 'product-series__panel';
  panel.setAttribute('role', 'tabpanel');

  for (const [index, item] of series.entries()) {
    tabList.appendChild(createSeriesTab(item, index === 0, panel, products));
  }

  container.replaceChildren(tabList, panel);
  const firstSeries = series[0];
  if (firstSeries) {
    renderSeries(panel, firstSeries, products);
  }
}

function createSeriesTab(
  series: ProductSeries,
  isSelected: boolean,
  panel: HTMLElement,
  products: readonly Product[],
): HTMLButtonElement {
  const tab = document.createElement('button');
  tab.className = 'product-series__tab';
  tab.type = 'button';
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-selected', String(isSelected));
  tab.textContent = td(series, 'name');

  if (isSelected) {
    tab.classList.add('product-series__tab--active');
  }

  tab.addEventListener('click', () => {
    const tabList = tab.parentElement;
    if (!tabList) {
      return;
    }

    for (const item of tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]')) {
      item.classList.toggle('product-series__tab--active', item === tab);
      item.setAttribute('aria-selected', String(item === tab));
    }

    renderSeries(panel, series, products);
    tab.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  });

  return tab;
}

function renderSeries(
  container: HTMLElement,
  series: ProductSeries,
  products: readonly Product[],
): void {
  const seriesProducts = products.filter((product) => product.group === series.id);
  const heading = document.createElement('div');
  heading.className = 'product-series__heading';

  const title = document.createElement('h3');
  title.className = 'product-series__title';
  title.textContent = td(series, 'name');

  const description = document.createElement('p');
  description.className = 'product-series__description';
  description.textContent = td(series, 'description');

  const applications = document.createElement('p');
  applications.className = 'product-series__applications';
  applications.textContent = td(series, 'applications');

  heading.append(title, description, applications);

  const grid = document.createElement('div');
  grid.className = 'product-series__grid';
  for (const product of seriesProducts) {
    grid.appendChild(createProductCard(product));
  }

  container.replaceChildren(heading, grid);
}

function createProductCard(product: Product): HTMLElement {
  const name = td(product, 'name');
  const description = product.description ? td(product, 'description') : '';
  const article = document.createElement('article');
  article.className = 'product-series__card';

  article.innerHTML = `
    <div class="product-series__media">
      <img
        class="product-series__image"
        src="${product.image}"
        alt="${name}"
        width="640"
        height="480"
        loading="lazy"
      />
    </div>
    <div class="product-series__card-body">
      <h4 class="product-series__card-title">${name}</h4>
      ${description ? `<p class="product-series__card-description">${description}</p>` : ''}
    </div>
  `;

  return article;
}
