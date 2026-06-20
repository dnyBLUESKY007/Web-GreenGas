import { applyPageMeta } from '@/config/pageMeta';
import { createFooter } from '@/components/footer/Footer';
import { createNavbar } from '@/components/navbar/Navbar';
import { initNavbarScroll } from '@/components/navbar/initNavbarScroll';
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
