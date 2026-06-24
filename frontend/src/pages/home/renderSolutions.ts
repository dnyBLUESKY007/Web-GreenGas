import solutionsData from '@/data/solutions.json';
import { td } from '@/i18n';
import { getIcon } from '@/utils/icons';
import { basePath } from '@/utils/path';
import type { Solution } from '@/types';

export function renderSolutions(container: HTMLElement): void {
  const solutions = solutionsData as readonly Solution[];
  const grid = document.createElement('div');
  grid.className = 'grid grid--4';

  for (const solution of solutions) {
    grid.appendChild(createSolutionCard(solution));
  }

  container.replaceChildren(grid);
}

function createSolutionCard(solution: Solution): HTMLElement {
  const name = td(solution, 'name');
  const summary = td(solution, 'summary');

  const link = document.createElement('a');
  link.className = 'scenario-card';
  link.href = basePath('/solutions/');

  const icon = document.createElement('div');
  icon.className = 'scenario-card__icon';
  icon.innerHTML = getIcon(solution.icon);

  const body = document.createElement('div');
  body.className = 'scenario-card__body';

  const title = document.createElement('h3');
  title.className = 'scenario-card__title';
  title.textContent = name;

  const desc = document.createElement('p');
  desc.className = 'scenario-card__summary';
  desc.textContent = summary;

  body.append(title, desc);
  link.append(icon, body);

  return link;
}
