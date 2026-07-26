import '@/styles/main.scss';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { setPageHeaderBackground } from '@/config/assets';
import productsData from '@/data/products.json';
import seriesData from '@/data/product-series.json';
import { t, td } from '@/i18n';
import type { Product, ProductSeries } from '@/types';
import { initPage } from '@/utils/mountLayout';
import { basePath } from '@/utils/path';

const products = productsData as readonly Product[];
const series = seriesData as readonly ProductSeries[];

function renderProductNavigation(): void {
  const main = document.getElementById('page-content');
  if (!main) return;

  const header = document.createElement('section');
  header.className = 'page-header';
  setPageHeaderBackground(header, '01_solutions.webp');
  header.appendChild(createSectionTitle({
    eyebrow: t('products.eyebrow'),
    title: t('products.title'),
    description: t('products.desc'),
  }));

  const catalogue = document.createElement('section');
  catalogue.className = 'section product-catalogue';
  const container = document.createElement('div');
  container.className = 'container';
  container.append(createContentNotice(), createSeriesNavigation());

  for (const item of series) {
    container.appendChild(createSeriesSection(item));
  }

  catalogue.appendChild(container);
  main.replaceChildren(header, catalogue);
}

function createContentNotice(): HTMLElement {
  const notice = document.createElement('aside');
  notice.className = 'product-status-notice';
  notice.innerHTML = `
    <strong>${t('products.status.example-placeholder')}</strong>
    <span>${t('products.placeholderNotice')}</span>
  `;
  return notice;
}

function createSeriesNavigation(): HTMLElement {
  const nav = document.createElement('nav');
  nav.className = 'product-catalogue__series-nav';
  nav.setAttribute('aria-label', t('products.seriesNav'));

  for (const item of series) {
    const link = document.createElement('a');
    link.href = `#series-${item.id}`;
    link.textContent = td(item, 'name');
    nav.appendChild(link);
  }

  return nav;
}

function createSeriesSection(item: ProductSeries): HTMLElement {
  const section = document.createElement('section');
  section.id = `series-${item.id}`;
  section.className = 'product-catalogue__series';

  const heading = document.createElement('header');
  heading.className = 'product-catalogue__series-heading';
  heading.innerHTML = `
    <p>${td(item, 'applications')}</p>
    <h2>${td(item, 'name')}</h2>
    <p>${td(item, 'description')}</p>
  `;

  const grid = document.createElement('div');
  grid.className = 'product-catalogue__grid';
  for (const product of products.filter(({ group }) => group === item.id)) {
    grid.appendChild(createProductCard(product, item));
  }

  section.append(heading, grid);
  return section;
}

function createProductCard(product: Product, productSeries: ProductSeries): HTMLElement {
  const card = document.createElement('article');
  card.className = 'product-card';
  const detailUrl = basePath(`/products/detail/?id=${product.id}`);
  const name = td(product, 'name');

  card.innerHTML = `
    <a class="product-card__media" href="${detailUrl}" aria-label="${name}">
      <img src="${product.image}" alt="${name}" width="640" height="480" loading="lazy" />
      <span class="product-status product-status--${product.contentStatus}">${t(`products.status.${product.contentStatus}`)}</span>
    </a>
    <div class="product-card__body">
      <p class="product-card__series">${td(productSeries, 'name')}</p>
      <h3><a href="${detailUrl}">${name}</a></h3>
      <p>${td(product, 'description')}</p>
      <a class="product-card__detail" href="${detailUrl}">${t('products.viewDetail')}</a>
    </div>
  `;
  return card;
}

initPage('products', renderProductNavigation);
