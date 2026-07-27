import '@/styles/main.scss';
import { createProductStatus } from '@/components/product-status/ProductStatus';
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
  const productName = td(product, 'name');

  const hero = document.createElement('section');
  hero.className = 'product-detail__hero';

  const heroGrid = document.createElement('div');
  heroGrid.className = 'container product-detail__hero-grid';

  const media = document.createElement('div');
  media.className = 'product-detail__media';
  const image = document.createElement('img');
  image.src = product.image;
  image.alt = productName;
  image.width = 960;
  image.height = 720;
  media.appendChild(image);
  const productStatus = createProductStatus(product.contentStatus);
  if (productStatus) media.appendChild(productStatus);

  const intro = document.createElement('div');
  intro.className = 'product-detail__intro';

  const backLink = document.createElement('a');
  backLink.className = 'product-detail__back';
  backLink.href = basePath('/products/');
  backLink.textContent = t('products.detail.back');

  const seriesName = document.createElement('p');
  seriesName.className = 'product-detail__series';
  seriesName.textContent = productSeries ? td(productSeries, 'name') : '';

  const title = document.createElement('h1');
  title.textContent = productName;

  const summary = document.createElement('p');
  summary.className = 'product-detail__summary';
  summary.textContent = td(product, 'description');

  const application = document.createElement('p');
  application.textContent = td(product, 'application') || td(product, 'description');

  const inquiryLink = document.createElement('a');
  inquiryLink.className = 'btn btn--primary';
  inquiryLink.href = basePath('/contact/');
  inquiryLink.textContent = t('products.detail.inquire');

  intro.append(backLink, seriesName, title, summary, application, inquiryLink);
  heroGrid.append(media, intro);
  hero.appendChild(heroGrid);

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
  const caption = document.createElement('caption');
  caption.textContent = t('products.detail.parameterNotice');
  table.appendChild(caption);
  const body = table.createTBody();
  for (const parameter of parameters) {
    const row = body.insertRow();
    const label = document.createElement('th');
    label.scope = 'row';
    label.textContent = td(parameter, 'label');
    row.appendChild(label);
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
    link.href = basePath(`/industries/#industry-${encodeURIComponent(industry.id)}`);
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

    const title = document.createElement('strong');
    title.textContent = td(download, 'title');
    item.appendChild(title);
    const downloadStatus = createProductStatus(download.status);
    if (downloadStatus) item.appendChild(downloadStatus);
    list.appendChild(item);
  }
  return createDetailSection('products.detail.downloads', list);
}

function createInquiry(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'product-detail__inquiry';

  const content = document.createElement('div');
  const title = document.createElement('h2');
  title.textContent = t('products.detail.inquiryTitle');
  const description = document.createElement('p');
  description.textContent = t('products.detail.inquiryDesc');
  content.append(title, description);

  const link = document.createElement('a');
  link.className = 'btn btn--primary';
  link.href = basePath('/contact/');
  link.textContent = t('products.detail.inquire');

  section.append(content, link);
  return section;
}

function createNotFound(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section product-detail__not-found';

  const container = document.createElement('div');
  container.className = 'container container--narrow';

  const code = document.createElement('p');
  code.className = 'product-detail__code';
  code.textContent = '404';

  const title = document.createElement('h1');
  title.textContent = t('products.notFound.title');

  const description = document.createElement('p');
  description.textContent = t('products.notFound.desc');

  const link = document.createElement('a');
  link.className = 'btn btn--primary';
  link.href = basePath('/products/');
  link.textContent = t('products.notFound.back');

  container.append(code, title, description, link);
  section.appendChild(container);
  return section;
}

initPage('products', renderProductDetail);
