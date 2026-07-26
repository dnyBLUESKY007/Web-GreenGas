import productsData from '@/data/products.json';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { t, td } from '@/i18n';
import { createProductStatus } from '@/pages/products/productView';
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
    title: t('home.products.title'),
    description: t('home.products.desc'),
  });

  const moreLink = document.createElement('a');
  moreLink.className = 'section-head__action';
  moreLink.href = basePath('/products/');
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

  const link = document.createElement('a');
  link.className = 'product-grid-card__link';
  link.href = basePath(`/products/detail/?id=${encodeURIComponent(product.id)}`);

  const media = document.createElement('div');
  media.className = 'product-grid-card__media card-media';
  const frame = document.createElement('div');
  frame.className = 'card-media__frame';
  const image = document.createElement('img');
  image.className = 'card-media__image';
  image.src = product.image;
  image.alt = name;
  image.width = 320;
  image.height = 240;
  image.loading = 'lazy';
  frame.appendChild(image);
  media.appendChild(frame);

  const body = document.createElement('div');
  body.className = 'product-grid-card__body';
  const status = createProductStatus(product.contentStatus);
  const title = document.createElement('h3');
  title.className = 'product-grid-card__name';
  title.textContent = name;
  const copy = document.createElement('p');
  copy.className = 'product-grid-card__desc';
  copy.textContent = description;
  body.append(status, title, copy);
  link.append(media, body);
  article.appendChild(link);

  return article;
}
