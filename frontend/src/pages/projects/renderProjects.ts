import { createProjectCard } from '@/components/project-card/ProjectCard';
import { projects } from '@/data/projects';

export function renderProjects(container: HTMLElement): void {
  const grid = document.createElement('div');
  grid.className = 'grid grid--projects';

  for (const project of projects) {
    grid.appendChild(createProjectCard(project));
  }

  container.replaceChildren(grid);
}
