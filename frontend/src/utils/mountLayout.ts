import { applyPageMeta } from '@/config/pageMeta';
import { createFooter } from '@/components/footer/Footer';
import { createNavbar } from '@/components/navbar/Navbar';
import { initNavbarScroll } from '@/components/navbar/initNavbarScroll';
import { createScrollToTop } from '@/components/scroll-to-top/ScrollToTop';
import { initI18n, onLocaleChange } from '@/i18n';
import { initTheme, onThemeChange } from '@/theme';
import { initScrollReveal } from '@/utils/initScrollReveal';
import type { PageId } from '@/types';

export function mountLayout(pageId: PageId): void {
  applyPageMeta(pageId);
  document.body.classList.remove('navbar-menu-open');

  const navbarMount = document.getElementById('site-navbar');
  const footerMount = document.getElementById('site-footer');

  if (navbarMount) {
    navbarMount.replaceChildren(createNavbar(pageId));
    initNavbarScroll();
  }

  if (footerMount) {
    footerMount.replaceChildren(createFooter());
  }

  ensureScrollToTop();
}

let scrollToTopMounted = false;

function ensureScrollToTop(): void {
  if (scrollToTopMounted) {
    return;
  }

  document.body.appendChild(createScrollToTop());
  scrollToTopMounted = true;
}

/**
 * Initializes i18n and wires layout + page content to locale changes.
 */
export function initPage(pageId: PageId, renderContent: () => void): void {
  initI18n();
  initTheme();

  const render = (): void => {
    mountLayout(pageId);
    renderContent();
    initScrollReveal();
  };

  onLocaleChange(render);
  onThemeChange(render);
  render();
}
