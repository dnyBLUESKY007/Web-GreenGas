import type { NavItem, PageId } from '@/types';
import { basePath } from '@/utils/path';

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'home', labelKey: 'nav.home', href: basePath('/') },
  { id: 'about', labelKey: 'nav.about', href: basePath('/about/') },
  { id: 'products', labelKey: 'nav.products', href: basePath('/products/') },
  { id: 'industries', labelKey: 'nav.industries', href: basePath('/industries/') },
  { id: 'support', labelKey: 'nav.support', href: basePath('/support/') },
  { id: 'cases', labelKey: 'nav.cases', href: basePath('/cases/') },
  { id: 'news', labelKey: 'nav.news', href: basePath('/news/') },
  { id: 'contact', labelKey: 'nav.contact', href: basePath('/contact/') },
];

export function getNavHref(pageId: PageId): string {
  const item = NAV_ITEMS.find((navItem) => navItem.id === pageId);
  return item?.href ?? basePath('/');
}
