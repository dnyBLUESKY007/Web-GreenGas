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
    const link = document.createElement('a');
    link.className = 'navbar__link';
    link.href = item.href;
    link.textContent = t(item.labelKey);

    if (item.id === activePageId) {
      link.classList.add('navbar__link--active');
      link.setAttribute('aria-current', 'page');
    }

    nav.appendChild(link);
  }

  const actions = document.createElement('div');
  actions.className = 'navbar__actions';

  const langSwitcher = createLangSwitcher();

  const cta = document.createElement('a');
  cta.className = 'btn btn--primary navbar__cta';
  cta.href = basePath('/contact/');
  cta.textContent = t('nav.cta');

  actions.append(langSwitcher, cta);
  inner.append(brand, nav, actions);
  header.appendChild(inner);

  return header;
}
