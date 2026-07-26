import '@/styles/main.scss';
import productsData from '@/data/products.json';
import seriesData from '@/data/product-series.json';
import { t, td } from '@/i18n';
import type {
  Product,
  ProductDownload,
  ProductFeature,
  ProductIndustry,
  ProductParameter,
  ProductSeries,
} from '@/types';
import { initPage } from '@/utils/mountLayout';
import { basePath } from '@/utils/path';

const products = productsData as readonly Product[];
const series = seriesData as readonly ProductSeries[];

function renderProductDetail(): void {
  const main = document.getElementById('page-content');
  if (!main) return;

  const id = new URLSearchParams(window.location.search).get('id');
  const product = products.find((item) => item.id === id);
  main.replaceChildren(product ? createProductDetail(product) : createNotFound());
}

function createProductDetail(product: Product): HTMLElement {
  const article = document.createElement('article');
  article.className = 'product-detail';
  const productSeries = series.find(({ id }) => id === product.group);

  const hero = document.createElement('section');
  hero.className = 'product-detail__hero';
  hero.innerHTML = `
    <div class="container product-detail__hero-grid">
      <div class="product-detail__media">
        <img src="${product.image}" alt="${td(product, 'name')}" width="960" height="720" />
        ${createStatusMarkup(product.contentStatus)}
      </div>
      <div class="product-detail__intro">
        <a class="product-detail__back" href="${basePath('/products/')}">${t('products.detail.back')}</a>
        <p class="product-detail__series">${productSeries ? td(productSeries, 'name') : ''}</p>
        <h1>${td(product, 'name')}</h1>
        <p class="product-detail__summary">${td(product, 'description')}</p>
        <p>${td(product, 'application') || td(product, 'description')}</p>
        <a class="btn btn--primary" href="${basePath('/contact/')}">${t('products.detail.inquire')}</a>
      </div>
    </div>
  `;

  const content = document.createElement('div');
  content.className = 'container product-detail__content';
  content.append(
    createFeatures(product.features),
    createParameters(product.parameters),
    createIndustries(product.industries),
    createDownloads(product.downloads),
    createInquiry(),
  );
  article.append(hero, content);
  return article;
}

function createStatusMarkup(status: Product['contentStatus']): string {
  return `<span class="product-status product-status--${status}">${t(`products.status.${status}`)}</span>`;
}

function createDetailSection(titleKey: string, content: HTMLElement): HTMLElement {
  const section = document.createElement('section');
  section.className = 'product-detail__section';
  const title = document.createElement('h2');
  title.textContent = t(titleKey);
  section.append(title, content);
  return section;
}

function createPendingContent(): HTMLElement {
  const pending = document.createElement('p');
  pending.className = 'product-detail__pending';
  pending.textContent = t('products.detail.pending');
  return pending;
}

function createFeatures(features: readonly ProductFeature[] | undefined): HTMLElement {
  if (!features?.length) return createDetailSection('products.detail.features', createPendingContent());
  const list = document.createElement('ul');
  list.className = 'product-detail__features';
  for (const feature of features) {
    const item = document.createElement('li');
    item.textContent = td(feature, 'text');
    list.appendChild(item);
  }
  return createDetailSection('products.detail.features', list);
}

function createParameters(parameters: readonly ProductParameter[] | undefined): HTMLElement {
  if (!parameters?.length) return createDetailSection('products.detail.parameters', createPendingContent());
  const wrapper = document.createElement('div');
  wrapper.className = 'product-detail__table-wrap';
  const table = document.createElement('table');
  table.innerHTML = `<caption>${t('products.detail.parameterNotice')}</caption><tbody></tbody>`;
  const body = table.tBodies[0];
  for (const parameter of parameters) {
    const row = body.insertRow();
    row.insertCell().textContent = td(parameter, 'label');
    row.insertCell().textContent = td(parameter, 'value');
  }
  wrapper.appendChild(table);
  return createDetailSection('products.detail.parameters', wrapper);
}

function createIndustries(industries: readonly ProductIndustry[] | undefined): HTMLElement {
  if (!industries?.length) return createDetailSection('products.detail.industries', createPendingContent());
  const list = document.createElement('div');
  list.className = 'product-detail__links';
  for (const industry of industries) {
    const link = document.createElement('a');
    link.href = basePath(`/industries/?id=${industry.id}`);
    link.textContent = td(industry, 'name');
    list.appendChild(link);
  }
  return createDetailSection('products.detail.industries', list);
}

function createDownloads(downloads: readonly ProductDownload[] | undefined): HTMLElement {
  if (!downloads?.length) return createDetailSection('products.detail.downloads', createPendingContent());
  const list = document.createElement('div');
  list.className = 'product-detail__downloads';
  for (const download of downloads) {
    const item = document.createElement(download.href ? 'a' : 'span');
    item.className = 'product-detail__download';
    if (download.href && item instanceof HTMLAnchorElement) item.href = download.href;
    if (!download.href) item.setAttribute('aria-disabled', 'true');
    item.innerHTML = `<strong>${td(download, 'title')}</strong>${createStatusMarkup(download.status)}`;
    list.appendChild(item);
  }
  return createDetailSection('products.detail.downloads', list);
}

function createInquiry(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'product-detail__inquiry';
  section.innerHTML = `
    <div>
      <h2>${t('products.detail.inquiryTitle')}</h2>
      <p>${t('products.detail.inquiryDesc')}</p>
    </div>
    <a class="btn btn--primary" href="${basePath('/contact/')}">${t('products.detail.inquire')}</a>
  `;
  return section;
}

function createNotFound(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section product-detail__not-found';
  section.innerHTML = `
    <div class="container container--narrow">
      <p class="product-detail__code">404</p>
      <h1>${t('products.notFound.title')}</h1>
      <p>${t('products.notFound.desc')}</p>
      <a class="btn btn--primary" href="${basePath('/products/')}">${t('products.notFound.back')}</a>
    </div>
  `;
  return section;
}

initPage('products', renderProductDetail);
