import type { NavItem, PageId } from '@/types';

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'home', labelKey: 'nav.home', href: '/' },
  { id: 'solutions', labelKey: 'nav.solutions', href: '/solutions/' },
  { id: 'about', labelKey: 'nav.about', href: '/about/' },
  { id: 'news', labelKey: 'nav.news', href: '/news/' },
  { id: 'faq', labelKey: 'nav.faq', href: '/faq/' },
  { id: 'contact', labelKey: 'nav.contact', href: '/contact/' },
] as const;

export function getNavHref(pageId: PageId): string {
  const item = NAV_ITEMS.find((navItem) => navItem.id === pageId);
  return item?.href ?? '/';
}
