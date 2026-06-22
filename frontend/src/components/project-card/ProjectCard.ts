import type { Project } from '@/types';
import { td } from '@/i18n';

export function createProjectCard(project: Project): HTMLElement {
  const name = td(project, 'name');
  const industry = td(project, 'industry');
  const summary = td(project, 'summary');

  const article = document.createElement('article');
  article.className = 'project-card';

  article.innerHTML = `
    <div class="project-card__media">
      <img
        class="project-card__image"
        src="${project.image}"
        alt="${name}"
        width="400"
        height="280"
        loading="lazy"
      />
    </div>
    <div class="project-card__body">
      <p class="project-card__meta">${industry} · ${project.location}</p>
      <h3 class="project-card__title">${name}</h3>
      <p class="project-card__summary">${summary}</p>
    </div>
  `;

  return article;
}
