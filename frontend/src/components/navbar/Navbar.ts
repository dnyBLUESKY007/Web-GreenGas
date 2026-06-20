import { NAV_ITEMS } from '@/config/navigation';
import type { PageId } from '@/types';

export function createNavbar(activePageId: PageId): HTMLElement {
  const header = document.createElement('header');
  header.className = 'navbar';

  const inner = document.createElement('div');
  inner.className = 'container navbar__inner';

  const brand = document.createElement('a');
  brand.className = 'navbar__brand';
  brand.href = '/';
  brand.textContent = 'GREENGAS';

  const nav = document.createElement('nav');
  nav.className = 'navbar__nav';
  nav.setAttribute('aria-label', 'Main navigation');

  for (const item of NAV_ITEMS) {
    const link = document.createElement('a');
    link.className = 'navbar__link';
    link.href = item.href;
    link.textContent = item.label;

    if (item.id === activePageId) {
      link.classList.add('navbar__link--active');
      link.setAttribute('aria-current', 'page');
    }

    nav.appendChild(link);
  }

  const cta = document.createElement('a');
  cta.className = 'btn btn--primary navbar__cta';
  cta.href = '/contact/';
  cta.textContent = 'Contact Us';

  inner.append(brand, nav, cta);
  header.appendChild(inner);

  return header;
}
