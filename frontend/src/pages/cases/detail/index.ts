import '@/styles/main.scss';
import { createProjectCard } from '@/components/project-card/ProjectCard';
import { cdnUrl } from '@/config/assets';
import projectsData from '@/data/projects.json';
import { t, td } from '@/i18n';
import type { Project } from '@/types';
import { initPage } from '@/utils/mountLayout';
import { basePath } from '@/utils/path';

const projects = projectsData as readonly Project[];

function renderCaseDetail(): void {
  const main = document.getElementById('page-content');
  if (!main) return;

  const id = new URLSearchParams(window.location.search).get('id');
  const project = projects.find((item) => item.id === id);
  main.replaceChildren(project ? createCaseDetail(project) : createNotFound());
}

function createCaseDetail(project: Project): HTMLElement {
  const article = document.createElement('article');
  article.className = 'case-detail';
  const result = td(project, 'result');
  const relatedCases = project.relatedCaseIds
    .map((id) => projects.find((item) => item.id === id))
    .filter((item): item is Project => item !== undefined);

  article.innerHTML = `
    <header class="case-detail__hero">
      <div class="container case-detail__hero-inner">
        <a class="case-detail__back" href="${basePath('/cases/')}">← ${t('cases.back')}</a>
        <span class="case-status case-status--${project.status}">${t(`cases.status.${project.status}`)}</span>
        <p class="case-detail__meta">${td(project, 'industry')} · ${td(project, 'location')}</p>
        <h1>${td(project, 'name')}</h1>
        <p class="case-detail__summary">${td(project, 'summary')}</p>
      </div>
    </header>
    <div class="section">
      <div class="container case-detail__layout">
        <div class="case-detail__content">
          ${createDetailSection('cases.detail.context', td(project, 'context'))}
          ${createDetailSection('cases.detail.challenge', td(project, 'challenge'))}
          ${createDetailSection('cases.detail.response', td(project, 'response'))}
          ${result ? createDetailSection('cases.detail.result', result) : ''}
        </div>
        <aside class="case-detail__facts" aria-label="${t('cases.detail.facts')}">
          <h2>${t('cases.detail.facts')}</h2>
          ${createFact('cases.detail.industry', td(project, 'industry'))}
          ${createFact('cases.detail.region', td(project, 'location'))}
          ${createFact('cases.detail.equipment', td(project, 'equipment'))}
          <a href="${project.sourceUrl}" target="_blank" rel="noreferrer">${t('cases.detail.source')}</a>
        </aside>
      </div>
      ${createGallery(project)}
      ${relatedCases.length > 0 ? createRelatedCases(relatedCases) : ''}
    </div>
  `;
  return article;
}

function createDetailSection(titleKey: string, content: string): string {
  return `<section class="case-detail__section"><h2>${t(titleKey)}</h2><p>${content}</p></section>`;
}

function createFact(labelKey: string, value: string): string {
  return `<dl><dt>${t(labelKey)}</dt><dd>${value}</dd></dl>`;
}

function createGallery(project: Project): string {
  const images = project.images
    .map(
      (image) => `
        <figure>
          <img src="${cdnUrl('projects', image.filename)}" alt="${td(image, 'alt')}" loading="lazy" />
        </figure>`,
    )
    .join('');
  return `<div class="container case-detail__gallery" aria-label="${t('cases.detail.gallery')}">${images}</div>`;
}

function createRelatedCases(relatedCases: readonly Project[]): string {
  const mount = document.createElement('div');
  mount.className = 'grid grid--projects';
  for (const project of relatedCases) {
    mount.appendChild(createProjectCard(project));
  }
  return `
    <section class="container case-detail__related">
      <h2>${t('cases.detail.related')}</h2>
      ${mount.outerHTML}
    </section>`;
}

function createNotFound(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section case-detail__empty';
  section.innerHTML = `
    <div class="container container--narrow">
      <p class="case-detail__empty-code">404</p>
      <h1>${t('cases.notFound.title')}</h1>
      <p>${t('cases.notFound.desc')}</p>
      <a class="button button--primary" href="${basePath('/cases/')}">${t('cases.back')}</a>
    </div>`;
  return section;
}

initPage('cases', renderCaseDetail);
