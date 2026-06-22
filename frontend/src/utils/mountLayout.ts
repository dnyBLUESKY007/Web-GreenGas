import { applyPageMeta } from '@/config/pageMeta';
import { createFooter } from '@/components/footer/Footer';
import { createNavbar } from '@/components/navbar/Navbar';
import { initNavbarScroll } from '@/components/navbar/initNavbarScroll';
import { initI18n, onLocaleChange } from '@/i18n';
import type { PageId } from '@/types';

export function mountLayout(pageId: PageId): void {
  applyPageMeta(pageId);

  const navbarMount = document.getElementById('site-navbar');
  const footerMount = document.getElementById('site-footer');

  if (navbarMount) {
    navbarMount.replaceChildren(createNavbar(pageId));
    initNavbarScroll();
  }

  if (footerMount) {
    footerMount.replaceChildren(createFooter());
  }
}

/**
 * Initializes i18n and wires layout + page content to locale changes.
 */
export function initPage(pageId: PageId, renderContent: () => void): void {
  initI18n();

  const render = (): void => {
    mountLayout(pageId);
    renderContent();
  };

  onLocaleChange(render);
  render();
}
