import '@/styles/main.scss';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { setPageHeaderBackground } from '@/config/assets';
import { t } from '@/i18n';
import { renderProducts } from '@/pages/solutions/renderProducts';
import { initPage } from '@/utils/mountLayout';

function renderSolutionsPage(): void {
  const main = document.getElementById('page-content');

  if (!main) {
    return;
  }

  const header = document.createElement('section');
  header.className = 'page-header';
  setPageHeaderBackground(header, '01_solutions.webp');
  header.appendChild(
    createSectionTitle({
      eyebrow: t('solutions.eyebrow'),
      title: t('solutions.title'),
      description: t('solutions.desc'),
    }),
  );

  const gridSection = document.createElement('section');
  gridSection.className = 'section';
  const container = document.createElement('div');
  container.className = 'container';
  const gridMount = document.createElement('div');
  gridMount.id = 'solutions-grid';
  container.appendChild(gridMount);
  gridSection.appendChild(container);

  main.replaceChildren(header, gridSection);
  renderProducts(gridMount);
}

initPage('solutions', renderSolutionsPage);
