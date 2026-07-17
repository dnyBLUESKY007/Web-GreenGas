import { createLangSwitcher } from '@/components/lang-switcher/LangSwitcher';
import { NAV_ITEMS } from '@/config/navigation';
import companyData from '@/data/company.json';
import { t } from '@/i18n';
import { basePath } from '@/utils/path';
import type { CompanyData, PageId } from '@/types';

const company = companyData as CompanyData;

export function createNavbar(activePageId: PageId): HTMLElement {
  const header = document.createElement('header');
  header.className = 'navbar';

  const inner = document.createElement('div');
  inner.className = 'container navbar__inner';

  const brand = document.createElement('a');
  brand.className = 'navbar__brand';
  brand.href = basePath('/');

  const brandEn = document.createElement('span');
  brandEn.className = 'navbar__brand-en';
  brandEn.textContent = company.name;

  const brandZh = document.createElement('span');
  brandZh.className = 'navbar__brand-zh';
  brandZh.textContent = company.name_zh ?? '';

  brand.append(brandEn, brandZh);

  const nav = document.createElement('nav');
  nav.className = 'navbar__nav';
  nav.setAttribute('aria-label', 'Main navigation');

  for (const item of NAV_ITEMS) {
    nav.appendChild(createNavLink(item, activePageId, 'navbar__link'));
  }

  const actions = document.createElement('div');
  actions.className = 'navbar__actions';

  const langSwitcher = createLangSwitcher();

  const menuToggle = document.createElement('button');
  menuToggle.className = 'navbar__menu-toggle';
  menuToggle.type = 'button';
  menuToggle.setAttribute('aria-controls', 'navbar-mobile-menu');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', t('nav.menu.open'));
  menuToggle.innerHTML = `
    <span class="navbar__menu-toggle-icon" aria-hidden="true"></span>
    <span class="navbar__menu-toggle-label">${t('nav.menu.label')}</span>
  `;

  const cta = document.createElement('a');
  cta.className = 'btn btn--primary navbar__cta';
  cta.href = basePath('/contact/');
  cta.textContent = t('nav.cta');

  actions.append(langSwitcher, menuToggle, cta);
  inner.append(brand, nav, actions);
  header.append(inner, createMobileMenu(activePageId, menuToggle, header));

  return header;
}

function createNavLink(
  item: (typeof NAV_ITEMS)[number],
  activePageId: PageId,
  className: string,
): HTMLAnchorElement {
  const link = document.createElement('a');
  link.className = className;
  link.href = item.href;
  link.textContent = t(item.labelKey);

  if (item.id === activePageId) {
    link.classList.add(`${className}--active`);
    link.setAttribute('aria-current', 'page');
  }

  return link;
}

function createMobileMenu(
  activePageId: PageId,
  menuToggle: HTMLButtonElement,
  header: HTMLElement,
): HTMLElement {
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'navbar__mobile-menu';
  mobileMenu.id = 'navbar-mobile-menu';
  mobileMenu.hidden = true;

  const backdrop = document.createElement('button');
  backdrop.className = 'navbar__backdrop';
  backdrop.type = 'button';
  backdrop.tabIndex = -1;
  backdrop.setAttribute('aria-label', t('nav.menu.close'));

  const drawer = document.createElement('nav');
  drawer.className = 'navbar__drawer';
  drawer.setAttribute('aria-label', 'Main navigation');

  for (const item of NAV_ITEMS) {
    drawer.appendChild(createNavLink(item, activePageId, 'navbar__drawer-link'));
  }

  const contactCta = document.createElement('a');
  contactCta.className = 'btn btn--primary navbar__drawer-cta';
  contactCta.href = basePath('/contact/');
  contactCta.textContent = t('nav.cta');
  drawer.appendChild(contactCta);
  mobileMenu.append(backdrop, drawer);

  let isOpen = false;

  const setOpen = (nextOpen: boolean, restoreFocus = false): void => {
    isOpen = nextOpen;
    header.classList.toggle('navbar--menu-open', nextOpen);
    header.classList.remove('navbar--hidden');
    document.body.classList.toggle('navbar-menu-open', nextOpen);
    menuToggle.setAttribute('aria-expanded', String(nextOpen));
    menuToggle.setAttribute('aria-label', t(nextOpen ? 'nav.menu.close' : 'nav.menu.open'));
    mobileMenu.hidden = !nextOpen;

    if (nextOpen) {
      drawer.querySelector<HTMLElement>('a')?.focus();
    } else if (restoreFocus) {
      menuToggle.focus();
    }
  };

  menuToggle.addEventListener('click', () => setOpen(!isOpen));
  backdrop.addEventListener('click', () => setOpen(false, true));
  drawer.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) {
      setOpen(false);
    }
  });
  header.addEventListener('keydown', (event) => {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false, true);
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = Array.from(
      drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    );
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  return mobileMenu;
}
