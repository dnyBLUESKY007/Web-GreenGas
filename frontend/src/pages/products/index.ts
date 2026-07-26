import '@/styles/main.scss';
import { createProductStatus } from '@/components/product-status/ProductStatus';
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

  const title = document.createElement('strong');
  title.textContent = t('products.status.example-placeholder');

  const description = document.createElement('span');
  description.textContent = t('products.placeholderNotice');

  notice.append(title, description);
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

  const applications = document.createElement('p');
  applications.textContent = td(item, 'applications');

  const title = document.createElement('h2');
  title.textContent = td(item, 'name');

  const description = document.createElement('p');
  description.textContent = td(item, 'description');

  heading.append(applications, title, description);

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
  const detailUrl = basePath(`/products/detail/?id=${encodeURIComponent(product.id)}`);
  const name = td(product, 'name');

  const mediaLink = document.createElement('a');
  mediaLink.className = 'product-card__media';
  mediaLink.href = detailUrl;
  mediaLink.setAttribute('aria-label', name);

  const image = document.createElement('img');
  image.src = product.image;
  image.alt = name;
  image.width = 640;
  image.height = 480;
  image.loading = 'lazy';
  mediaLink.append(image, createProductStatus(product.contentStatus));

  const body = document.createElement('div');
  body.className = 'product-card__body';

  const seriesName = document.createElement('p');
  seriesName.className = 'product-card__series';
  seriesName.textContent = td(productSeries, 'name');

  const heading = document.createElement('h3');
  const titleLink = document.createElement('a');
  titleLink.href = detailUrl;
  titleLink.textContent = name;
  heading.appendChild(titleLink);

  const description = document.createElement('p');
  description.textContent = td(product, 'description');

  const detailLink = document.createElement('a');
  detailLink.className = 'product-card__detail';
  detailLink.href = detailUrl;
  detailLink.textContent = t('products.viewDetail');

  body.append(seriesName, heading, description, detailLink);
  card.append(mediaLink, body);
  return card;
}

initPage('products', renderProductNavigation);
