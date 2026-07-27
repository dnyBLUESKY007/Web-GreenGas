import { t } from '@/i18n';
import type { ContentStatus } from '@/types';

export function createProductStatus(status: ContentStatus): HTMLSpanElement | undefined {
  if (status === 'verified-content') return undefined;

  const badge = document.createElement('span');
  badge.className = `product-status product-status--${status}`;
  badge.textContent = t(`products.status.${status}`);
  return badge;
}
