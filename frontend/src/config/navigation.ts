import type { NavItem, PageId } from '@/types';

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'solutions', label: 'Solutions', href: '/solutions/' },
  { id: 'about', label: 'About', href: '/about/' },
  { id: 'news', label: 'News', href: '/news/' },
  { id: 'contact', label: 'Contact', href: '/contact/' },
] as const;

export function getNavHref(pageId: PageId): string {
  const item = NAV_ITEMS.find((navItem) => navItem.id === pageId);
  return item?.href ?? '/';
}
