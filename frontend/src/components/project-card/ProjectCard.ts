import type { Project } from '@/types';
import { t, td } from '@/i18n';
import { cdnUrl } from '@/config/assets';
import { basePath } from '@/utils/path';

export function createProjectCard(project: Project): HTMLElement {
  const name = td(project, 'name');
  const industry = td(project, 'industry');
  const summary = td(project, 'summary');
  const location = td(project, 'location');
  const equipment = td(project, 'equipment');
  const image = project.images[0];

  const article = document.createElement('article');
  article.className = 'project-card';

  const link = document.createElement('a');
  link.className = 'project-card__link';
  link.href = `${basePath('/cases/detail/')}?id=${encodeURIComponent(project.id)}`;
  link.innerHTML = `
    <div class="project-card__media">
      <img
        class="project-card__image"
        src="${cdnUrl('projects', image.filename)}"
        alt="${td(image, 'alt')}"
        width="400"
        height="280"
        loading="lazy"
      />
    </div>
    <div class="project-card__body">
      <div class="project-card__topline">
        <p class="project-card__meta">${industry} · ${location}</p>
        <span class="case-status case-status--${project.status}">${t(`cases.status.${project.status}`)}</span>
      </div>
      <h3 class="project-card__title">${name}</h3>
      <p class="project-card__equipment">${equipment}</p>
      <p class="project-card__summary">${summary}</p>
      <span class="project-card__more">${t('cases.viewDetail')}</span>
    </div>
  `;
  article.appendChild(link);

  return article;
}
