import type { NavItem, PageId } from '@/types';
import { basePath } from '@/utils/path';

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'home', labelKey: 'nav.home', href: basePath('/') },
  { id: 'solutions', labelKey: 'nav.solutions', href: basePath('/solutions/') },
  { id: 'about', labelKey: 'nav.about', href: basePath('/about/') },
  { id: 'news', labelKey: 'nav.news', href: basePath('/news/') },
  { id: 'faq', labelKey: 'nav.faq', href: basePath('/faq/') },
  { id: 'contact', labelKey: 'nav.contact', href: basePath('/contact/') },
];

export function getNavHref(pageId: PageId): string {
  const item = NAV_ITEMS.find((navItem) => navItem.id === pageId);
  return item?.href ?? basePath('/');
}
