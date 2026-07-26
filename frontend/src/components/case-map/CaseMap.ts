import { caseMapPoints } from '@/data/caseMap';
import { getProjectById } from '@/data/projects';
import { t, td } from '@/i18n';
import type { CaseMapPoint, Project } from '@/types';
import { basePath } from '@/utils/path';

const DETAILS_ID = 'case-map-details';
let selectedPointId: string | undefined;

export function createCaseMap(visibleProjectIds: ReadonlySet<string>): HTMLElement {
  const points = caseMapPoints.filter(
    (point) => point.type === 'market-coverage' || visibleProjectIds.has(point.projectId),
  );
  const selectedPoint = points.find(({ id }) => id === selectedPointId) ?? points[0];
  selectedPointId = selectedPoint?.id;

  const section = document.createElement('section');
  section.className = 'case-map';
  section.setAttribute('aria-labelledby', 'case-map-title');

  const heading = document.createElement('div');
  heading.className = 'case-map__heading';
  heading.innerHTML = `
    <div>
      <p class="case-map__eyebrow">${t('cases.map.eyebrow')}</p>
      <h2 id="case-map-title">${t('cases.map.title')}</h2>
    </div>
    <p>${t('cases.map.description')}</p>
  `;

  const legend = document.createElement('ul');
  legend.className = 'case-map__legend';
  legend.setAttribute('aria-label', t('cases.map.legend.label'));
  legend.innerHTML = `
    <li><span class="case-map__legend-mark case-map__legend-mark--verified" aria-hidden="true"></span>${t('cases.map.legend.verified')}</li>
    <li><span class="case-map__legend-mark case-map__legend-mark--coverage" aria-hidden="true"></span>${t('cases.map.legend.coverage')}</li>
  `;

  const layout = document.createElement('div');
  layout.className = 'case-map__layout';
  const stage = createMapStage(points, selectedPoint?.id);
  const details = document.createElement('article');
  details.id = DETAILS_ID;
  details.className = 'case-map__details';
  details.setAttribute('aria-live', 'polite');
  if (selectedPoint) renderPointDetails(details, selectedPoint);

  stage.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-map-point]');
    if (!button) return;
    const point = points.find(({ id }) => id === button.dataset.mapPoint);
    if (!point) return;

    selectedPointId = point.id;
    for (const control of stage.querySelectorAll<HTMLButtonElement>('[data-map-point]')) {
      control.setAttribute('aria-pressed', String(control === button));
    }
    renderPointDetails(details, point);
  });

  layout.append(stage, details);
  const note = document.createElement('p');
  note.className = 'case-map__precision-note';
  note.textContent = t('cases.map.precisionNote');
  section.append(heading, legend, layout, note);
  return section;
}

function createMapStage(points: readonly CaseMapPoint[], selectedId: string | undefined): HTMLElement {
  const stage = document.createElement('div');
  stage.className = 'case-map__stage';
  stage.innerHTML = `
    <svg class="case-map__world" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M70 105 155 62l120 18 55 55-30 58-77 7-30 72-55-24-18-74-58-25Z" />
      <path d="m265 266 54 18 39 67-17 92-43 47-25-80-35-65Z" />
      <path d="m430 95 85-34 79 24 42-20 142 16 135 67-35 73-112 12-57 49-70-31-57 20-42-56-89-21-52-57Z" />
      <path d="m484 252 92-3 53 57-31 122-66 24-43-95-43-49Z" />
      <path d="m791 336 83-35 85 51-31 79-101 4-58-51Z" />
      <path d="m898 224 27-16 20 31-29 23Z" />
    </svg>
  `;

  for (const point of points) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `case-map__point case-map__point--${point.type === 'verified-case' ? 'verified' : 'coverage'}`;
    button.style.left = `${point.x}%`;
    button.style.top = `${point.y}%`;
    button.dataset.mapPoint = point.id;
    button.setAttribute('aria-controls', DETAILS_ID);
    button.setAttribute('aria-pressed', String(point.id === selectedId));
    button.setAttribute('aria-label', getPointLabel(point));
    button.title = getPointLabel(point);
    stage.appendChild(button);
  }
  return stage;
}

function getPointLabel(point: CaseMapPoint): string {
  if (point.type === 'market-coverage') {
    return `${t('cases.map.legend.coverage')}: ${td(point, 'name')}. ${t('cases.map.precision.country')}`;
  }

  const project = requireProject(point.projectId);
  return `${t('cases.map.legend.verified')}: ${td(project, 'name')}. ${getPrecisionLabel(project)}`;
}

function renderPointDetails(container: HTMLElement, point: CaseMapPoint): void {
  container.replaceChildren();
  const type = document.createElement('p');
  type.className = `case-map__type case-map__type--${point.type === 'verified-case' ? 'verified' : 'coverage'}`;
  type.textContent = t(`cases.map.legend.${point.type === 'verified-case' ? 'verified' : 'coverage'}`);

  const title = document.createElement('h3');
  const location = document.createElement('p');
  location.className = 'case-map__location';
  container.append(type, title, location);

  if (point.type === 'market-coverage') {
    title.textContent = td(point, 'name');
    location.textContent = t('cases.map.precision.country');
    const warning = document.createElement('p');
    warning.className = 'case-map__coverage-note';
    warning.textContent = t('cases.map.coverageOnly');
    container.appendChild(warning);
    return;
  }

  const project = requireProject(point.projectId);
  title.textContent = td(project, 'name');
  location.textContent = `${td(project, 'location')} · ${getPrecisionLabel(project)}`;
  const actions = document.createElement('div');
  actions.className = 'case-map__actions';
  actions.append(
    createLink(`${basePath('/cases/detail/')}?id=${encodeURIComponent(project.id)}`, t('cases.map.viewCase')),
    createLink(`#case-card-${project.id}`, t('cases.map.showInList')),
  );
  container.appendChild(actions);
}

function createLink(href: string, label: string): HTMLAnchorElement {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = label;
  return link;
}

function getPrecisionLabel(project: Project): string {
  return t(`cases.map.precision.${project.geography.precision}`);
}

function requireProject(projectId: string): Project {
  const project = getProjectById(projectId);
  if (!project) throw new Error(`Unknown case map project "${projectId}"`);
  return project;
}
