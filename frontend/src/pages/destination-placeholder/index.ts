import '@/styles/main.scss';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { t } from '@/i18n';
import type { PageId } from '@/types';
import { initPage } from '@/utils/mountLayout';

const PLACEHOLDER_PAGE_IDS = ['industries', 'support', 'cases'] as const satisfies readonly PageId[];

type PlaceholderPageId = (typeof PLACEHOLDER_PAGE_IDS)[number];

function isPlaceholderPageId(value: string | undefined): value is PlaceholderPageId {
  return value !== undefined && PLACEHOLDER_PAGE_IDS.some((pageId) => pageId === value);
}

const pageId = document.body.dataset.page;

if (!isPlaceholderPageId(pageId)) {
  throw new Error('Invalid destination placeholder page');
}

function renderPlaceholder(): void {
  const main = document.getElementById('page-content');
  if (!main) return;

  const header = document.createElement('section');
  header.className = 'page-header';
  header.appendChild(
    createSectionTitle({
      title: t(`destination.${pageId}.title`),
      description: t(`destination.${pageId}.desc`),
    }),
  );
  main.replaceChildren(header);
}

initPage(pageId, renderPlaceholder);
