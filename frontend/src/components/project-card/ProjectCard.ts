import type { Project } from '@/types';

export function createProjectCard(project: Project): HTMLElement {
  const article = document.createElement('article');
  article.className = 'project-card';

  article.innerHTML = `
    <div class="project-card__media">
      <img
        class="project-card__image"
        src="${project.image}"
        alt="${project.name}"
        width="400"
        height="280"
        loading="lazy"
      />
    </div>
    <div class="project-card__body">
      <p class="project-card__meta">${project.industry} · ${project.location}</p>
      <h3 class="project-card__title">${project.name}</h3>
      <p class="project-card__summary">${project.summary}</p>
    </div>
  `;

  return article;
}
