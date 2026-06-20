import { createProjectCard } from '@/components/project-card/ProjectCard';
import projectsData from '@/data/projects.json';
import type { Project } from '@/types';

export function renderProjects(container: HTMLElement): void {
  const projects = projectsData as readonly Project[];
  const grid = document.createElement('div');
  grid.className = 'grid grid--projects';

  for (const project of projects) {
    grid.appendChild(createProjectCard(project));
  }

  container.replaceChildren(grid);
}
