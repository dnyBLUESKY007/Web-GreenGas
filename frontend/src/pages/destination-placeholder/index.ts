import '@/styles/main.scss';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { t } from '@/i18n';
import type { PageId } from '@/types';
import { initPage } from '@/utils/mountLayout';

type PlaceholderPageId = Extract<PageId, 'industries' | 'support' | 'cases'>;

const pageId = document.body.dataset.page as PlaceholderPageId | undefined;

if (!pageId || !['industries', 'support', 'cases'].includes(pageId)) {
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
