import '@/styles/main.scss';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { setPageHeaderBackground } from '@/config/assets';
import { t } from '@/i18n';
import { renderProducts } from '@/pages/solutions/renderProducts';
import { renderClassicCases, renderScenarioPath } from '@/pages/solutions/renderScenarioPath';
import { initPage } from '@/utils/mountLayout';
import { basePath } from '@/utils/path';

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

  const jumpNav = document.createElement('nav');
  jumpNav.className = 'solutions-jump';
  jumpNav.setAttribute('aria-label', t('solutions.title'));
  jumpNav.innerHTML = `
    <a href="#scenarios">${t('solutions.jump.scenarios')}</a>
    <a href="#products">${t('solutions.jump.products')}</a>
  `;

  const scenarioMount = createSection(
    'scenarios',
    'solutions-path solutions-path--scenarios section',
    'solutions.scenarios',
  );
  const casesMount = createSection(
    'cases',
    'solutions-path solutions-path--cases section section--muted',
    'solutions.cases',
  );
  const productMount = createSection(
    'products',
    'solutions-path solutions-path--products section',
    'solutions.products',
  );
  const cta = createCta();

  main.replaceChildren(header, jumpNav, scenarioMount.section, casesMount.section, productMount.section, cta);
  renderScenarioPath(scenarioMount.content);
  renderClassicCases(casesMount.content);
  renderProducts(productMount.content);
}

function createSection(
  id: string,
  className: string,
  copyKey: 'solutions.scenarios' | 'solutions.cases' | 'solutions.products',
): { readonly section: HTMLElement; readonly content: HTMLElement } {
  const section = document.createElement('section');
  section.id = id;
  section.className = className;

  const container = document.createElement('div');
  container.className = 'container';
  container.appendChild(
    createSectionTitle({
      eyebrow: t(`${copyKey}.eyebrow`),
      title: t(`${copyKey}.title`),
      description: t(`${copyKey}.desc`),
    }),
  );

  const content = document.createElement('div');
  container.appendChild(content);
  section.appendChild(container);

  return { section, content };
}

function createCta(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section solutions-cta';

  const container = document.createElement('div');
  container.className = 'container solutions-cta__inner';

  const title = document.createElement('h2');
  title.className = 'solutions-cta__title';
  title.textContent = t('solutions.cta.title');

  const action = document.createElement('a');
  action.className = 'btn btn--primary';
  action.href = basePath('/contact/');
  action.textContent = t('solutions.cta.action');

  container.append(title, action);
  section.appendChild(container);
  return section;
}

initPage('products', renderSolutionsPage);
