import { createLangSwitcher } from '@/components/lang-switcher/LangSwitcher';
import { NAV_ITEMS } from '@/config/navigation';
import companyData from '@/data/company.json';
import { t } from '@/i18n';
import { basePath } from '@/utils/path';
import type { CompanyData, PageId } from '@/types';

const company = companyData as CompanyData;
type ActionPanel = 'language' | 'menu';

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
  nav.setAttribute('aria-label', t('nav.main.label'));

  for (const item of NAV_ITEMS) {
    nav.appendChild(createNavLink(item, activePageId, 'navbar__link'));
  }

  inner.append(brand, nav);
  header.appendChild(inner);
  document.body.appendChild(createMobileActionDock(activePageId));

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

function createMobileActionDock(activePageId: PageId): HTMLElement {
  const dock = document.createElement('aside');
  dock.className = 'navbar__mobile-actions';
  dock.id = 'navbar-mobile-actions';
  dock.setAttribute('aria-label', t('nav.mobileActions.label'));

  const panel = document.createElement('div');
  panel.className = 'navbar__action-panel';
  panel.hidden = true;

  const buttons = document.createElement('div');
  buttons.className = 'navbar__action-buttons';

  const topButton = createActionButton('navbar__action-button--top', t('nav.top.label'), topIcon());
  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const languageButton = createActionButton('navbar__action-button--language', t('nav.language.label'), languageIcon());
  const menuButton = createActionButton('navbar__action-button--menu', t('nav.menu.open'), menuIcon());
  languageButton.setAttribute('aria-controls', 'navbar-mobile-action-panel');
  menuButton.setAttribute('aria-controls', 'navbar-mobile-action-panel');
  languageButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-expanded', 'false');

  panel.id = 'navbar-mobile-action-panel';
  buttons.append(topButton, languageButton, menuButton);
  dock.append(panel, buttons);

  let activePanel: ActionPanel | null = null;
  const closePanel = (): void => {
    activePanel = null;
    panel.hidden = true;
    panel.replaceChildren();
    languageButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-expanded', 'false');
  };

  const closePanelAndRestoreFocus = (): void => {
    const trigger = activePanel === 'language' ? languageButton : menuButton;
    closePanel();
    trigger.focus();
  };

  const openPanel = (nextPanel: ActionPanel): void => {
    if (activePanel === nextPanel) {
      closePanel();
      return;
    }

    activePanel = nextPanel;
    panel.replaceChildren();
    panel.hidden = false;
    languageButton.setAttribute('aria-expanded', String(nextPanel === 'language'));
    menuButton.setAttribute('aria-expanded', String(nextPanel === 'menu'));

    if (nextPanel === 'language') {
      panel.appendChild(createLangSwitcher(closePanel));
      panel.querySelector<HTMLElement>('button')?.focus();
      return;
    }

    const menu = document.createElement('nav');
    menu.className = 'navbar__action-menu';
    menu.setAttribute('aria-label', t('nav.main.label'));
    for (const item of NAV_ITEMS) {
      menu.appendChild(createNavLink(item, activePageId, 'navbar__action-menu-link'));
    }
    menu.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).closest('a')) closePanel();
    });
    panel.appendChild(menu);
    menu.querySelector<HTMLAnchorElement>('a')?.focus();
  };

  languageButton.addEventListener('click', () => openPanel('language'));
  menuButton.addEventListener('click', () => openPanel('menu'));
  dock.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activePanel) {
      event.preventDefault();
      closePanelAndRestoreFocus();
    }
  });

  return dock;
}

function createActionButton(className: string, label: string, icon: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = `navbar__action-button ${className}`;
  button.type = 'button';
  button.setAttribute('aria-label', label);
  button.innerHTML = icon;
  return button;
}

function topIcon(): string {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m18 15-6-6-6 6"/><path d="M12 9v10"/></svg>';
}

function languageIcon(): string {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.2 2.5 3.3 5.5 3.3 9S14.2 18.5 12 21c-2.2-2.5-3.3-5.5-3.3-9S9.8 5.5 12 3Z"/></svg>';
}

function menuIcon(): string {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
}
