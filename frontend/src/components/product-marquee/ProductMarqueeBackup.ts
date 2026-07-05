import productsData from '@/data/products.json';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { t, td } from '@/i18n';
import { basePath } from '@/utils/path';
import type { Product } from '@/types';

/** @deprecated Backup component — not used on homepage. */
export function createProductMarqueeBackup(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section section--muted section--bleed product-marquee-section';

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

  const products = productsData as readonly Product[];
  const half = Math.ceil(products.length / 2);
  const row1Products = products.slice(0, half);
  const row2Products = products.slice(half);

  const rows = document.createElement('div');
  rows.className = 'product-marquee__rows';

  rows.append(
    createMarqueeRow(row1Products, false),
    createMarqueeRow(row2Products, true),
  );

  container.append(head, rows);
  section.appendChild(container);

  return section;
}

function createMarqueeRow(products: readonly Product[], reverse: boolean): HTMLElement {
  const row = document.createElement('div');
  row.className = 'product-marquee__row';

  if (reverse) {
    row.classList.add('product-marquee__row--reverse');
  }

  const track = document.createElement('div');
  track.className = 'product-marquee__track';

  const group = document.createElement('div');
  group.className = 'product-marquee__group';

  for (const product of products) {
    group.appendChild(createProductCard(product));
  }

  const clone = group.cloneNode(true) as HTMLElement;
  track.append(group, clone);
  row.appendChild(track);

  return row;
}

function createProductCard(product: Product): HTMLElement {
  const name = td(product, 'name');

  const article = document.createElement('article');
  article.className = 'product-marquee-card';

  article.innerHTML = `
    <div class="product-marquee-card__media">
      <img
        class="product-marquee-card__image"
        src="${product.image}"
        alt="${name}"
        width="200"
        height="150"
        loading="lazy"
      />
    </div>
    <p class="product-marquee-card__name">${name}</p>
  `;

  return article;
}
