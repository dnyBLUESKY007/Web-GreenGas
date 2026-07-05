import solutionsData from '@/data/solutions.json';
import { t, td } from '@/i18n';
import { getIcon } from '@/utils/icons';
import { basePath } from '@/utils/path';
import type { Solution } from '@/types';

const solutions = solutionsData as readonly Solution[];

export function renderSolutions(container: HTMLElement): void {
  const panel = document.createElement('div');
  panel.className = 'solutions-panel';

  const detail = document.createElement('div');
  detail.className = 'solutions-panel__detail';
  detail.id = 'solutions-panel-detail';

  const nav = document.createElement('div');
  nav.className = 'solutions-panel__nav';
  nav.setAttribute('role', 'tablist');
  nav.setAttribute('aria-orientation', 'vertical');

  for (const [index, solution] of solutions.entries()) {
    nav.appendChild(createNavCard(solution, index === 0, detail));
  }

  panel.append(detail, nav);
  container.replaceChildren(panel);

  if (solutions.length > 0) {
    renderDetail(detail, solutions[0]);
  }
}

function createNavCard(
  solution: Solution,
  isActive: boolean,
  detailEl: HTMLElement,
): HTMLElement {
  const name = td(solution, 'name');
  const summary = td(solution, 'summary');

  const link = document.createElement('a');
  link.className = 'solutions-panel__card';
  link.href = basePath('/solutions/');
  link.setAttribute('role', 'tab');
  link.setAttribute('aria-selected', String(isActive));

  if (isActive) {
    link.classList.add('solutions-panel__card--active');
  }

  const icon = document.createElement('div');
  icon.className = 'solutions-panel__card-icon';
  icon.innerHTML = getIcon(solution.icon);

  const body = document.createElement('div');
  body.className = 'solutions-panel__card-body';

  const title = document.createElement('h3');
  title.className = 'solutions-panel__card-title';
  title.textContent = name;

  const desc = document.createElement('p');
  desc.className = 'solutions-panel__card-summary';
  desc.textContent = summary;

  body.append(title, desc);
  link.append(icon, body);

  link.addEventListener('mouseenter', () => {
    setActiveCard(link, detailEl, solution);
  });

  link.addEventListener('focus', () => {
    setActiveCard(link, detailEl, solution);
  });

  return link;
}

function setActiveCard(
  activeLink: HTMLElement,
  detailEl: HTMLElement,
  solution: Solution,
): void {
  const nav = activeLink.parentElement;
  if (!nav) {
    return;
  }

  for (const card of nav.querySelectorAll<HTMLElement>('.solutions-panel__card')) {
    card.classList.remove('solutions-panel__card--active');
    card.setAttribute('aria-selected', 'false');
  }

  activeLink.classList.add('solutions-panel__card--active');
  activeLink.setAttribute('aria-selected', 'true');
  renderDetail(detailEl, solution);
}

function renderDetail(container: HTMLElement, solution: Solution): void {
  const name = td(solution, 'name');
  const detail = td(solution, 'detail');
  const challenge = td(solution, 'challenge');
  const response = td(solution, 'response');
  const imageSrc = solution.image.startsWith('/')
    ? basePath(solution.image)
    : solution.image;

  container.innerHTML = `
    <div class="solutions-panel__media">
      <img
        class="solutions-panel__image"
        src="${imageSrc}"
        alt="${name}"
        width="480"
        height="480"
        loading="lazy"
      />
    </div>
    <div class="solutions-panel__copy">
      <h3 class="solutions-panel__title">${name}</h3>
      <p class="solutions-panel__intro">${detail}</p>
      <div class="solutions-panel__block">
        <h4 class="solutions-panel__label">${t('home.solutions.challenge')}</h4>
        <p class="solutions-panel__text">${challenge}</p>
      </div>
      <div class="solutions-panel__block">
        <h4 class="solutions-panel__label">${t('home.solutions.response')}</h4>
        <p class="solutions-panel__text">${response}</p>
      </div>
    </div>
  `;
}
