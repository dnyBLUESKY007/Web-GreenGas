import '@/styles/main.scss';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { renderProducts } from '@/pages/solutions/renderProducts';
import { mountLayout } from '@/utils/mountLayout';

function renderSolutionsPage(): void {
  const main = document.getElementById('page-content');

  if (!main) {
    return;
  }

  const header = document.createElement('section');
  header.className = 'page-header';
  header.appendChild(
    createSectionTitle({
      eyebrow: 'Solutions',
      title: 'Industrial Cooling by Scenario',
      description:
        'Browse systems designed for specific operating environments. Each solution can be customized to your facility requirements.',
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

mountLayout('solutions');
renderSolutionsPage();
