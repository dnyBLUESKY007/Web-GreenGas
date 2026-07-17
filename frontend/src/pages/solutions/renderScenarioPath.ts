import { createProjectCard } from '@/components/project-card/ProjectCard';
import { cdnUrl } from '@/config/assets';
import projectsData from '@/data/projects.json';
import solutionsData from '@/data/solutions.json';
import { t, td } from '@/i18n';
import { getIcon } from '@/utils/icons';
import type { Project, Solution } from '@/types';

export function renderScenarioPath(container: HTMLElement): void {
  const solutions = solutionsData as readonly Solution[];
  const navigation = document.createElement('div');
  navigation.className = 'scenario-path__tabs';
  navigation.setAttribute('role', 'tablist');
  navigation.setAttribute('aria-label', t('solutions.scenarios.title'));

  const detail = document.createElement('div');
  detail.className = 'scenario-path__detail';
  detail.setAttribute('role', 'tabpanel');

  for (const [index, solution] of solutions.entries()) {
    navigation.appendChild(createScenarioTab(solution, index === 0, navigation, detail));
  }

  container.replaceChildren(navigation, detail);
  const first = solutions[0];
  if (first) {
    renderScenarioDetail(detail, first);
  }
}

export function renderClassicCases(container: HTMLElement): void {
  const projects = projectsData as readonly Project[];
  const grid = document.createElement('div');
  grid.className = 'solutions-cases__grid';

  for (const project of projects) {
    grid.appendChild(createProjectCard(project));
  }

  container.replaceChildren(grid);
}

function createScenarioTab(
  solution: Solution,
  isSelected: boolean,
  navigation: HTMLElement,
  detail: HTMLElement,
): HTMLButtonElement {
  const tab = document.createElement('button');
  tab.className = 'scenario-path__tab';
  tab.type = 'button';
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-selected', String(isSelected));
  tab.innerHTML = `${getIcon(solution.icon)}<span>${td(solution, 'name')}</span>`;

  if (isSelected) {
    tab.classList.add('scenario-path__tab--active');
  }

  tab.addEventListener('click', () => {
    for (const item of navigation.querySelectorAll<HTMLButtonElement>('[role="tab"]')) {
      item.classList.toggle('scenario-path__tab--active', item === tab);
      item.setAttribute('aria-selected', String(item === tab));
    }
    renderScenarioDetail(detail, solution);
    tab.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  });

  return tab;
}

function renderScenarioDetail(container: HTMLElement, solution: Solution): void {
  const name = td(solution, 'name');
  const summary = td(solution, 'summary');
  const challenge = td(solution, 'challenge');
  const response = td(solution, 'response');

  const image = document.createElement('img');
  image.className = 'scenario-path__image';
  image.src = cdnUrl('web', solution.image);
  image.alt = name;
  image.width = 720;
  image.height = 520;
  image.loading = 'lazy';

  const media = document.createElement('div');
  media.className = 'scenario-path__media';
  media.appendChild(image);

  const copy = document.createElement('div');
  copy.className = 'scenario-path__copy';
  copy.innerHTML = `
    <p class="scenario-path__summary">${summary}</p>
    <div class="scenario-path__item">
      <h3>${t('home.solutions.challenge')}</h3>
      <p>${challenge}</p>
    </div>
    <div class="scenario-path__item">
      <h3>${t('home.solutions.response')}</h3>
      <p>${response}</p>
    </div>
  `;

  container.replaceChildren(media, copy);
}
