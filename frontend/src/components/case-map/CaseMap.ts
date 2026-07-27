import worldMapUrl from '@/assets/maps/world-map.svg?url';
import { caseMapPoints } from '@/data/caseMap';
import { getProjectById } from '@/data/projects';
import { t, td } from '@/i18n';
import type { CaseMapPoint, Project } from '@/types';
import { basePath } from '@/utils/path';

const DETAILS_ID = 'case-map-details';
let selectedPointId: string | undefined;

export function createCaseMap(visibleProjectIds: ReadonlySet<string>): HTMLElement {
  const visiblePoints = caseMapPoints.filter(
    (point) => point.type === 'market-coverage' || visibleProjectIds.has(point.projectId),
  );
  const selectedPoint = visiblePoints.find(({ id }) => id === selectedPointId) ?? visiblePoints[0];
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
    <li><span class="case-map__legend-mark case-map__legend-mark--verified" aria-hidden="true"></span>${t('cases.map.legend.project')}</li>
    <li><span class="case-map__legend-mark case-map__legend-mark--coverage" aria-hidden="true"></span>${t('cases.map.legend.coverage')}</li>
  `;

  const layout = document.createElement('div');
  layout.className = 'case-map__layout';
  const stage = createMapStage(visiblePoints, selectedPoint?.id);
  const mapPanel = document.createElement('div');
  mapPanel.className = 'case-map__map-panel';
  mapPanel.append(stage, createPointSelector(visiblePoints, selectedPoint?.id));
  const details = document.createElement('article');
  details.id = DETAILS_ID;
  details.className = 'case-map__details';
  details.setAttribute('aria-live', 'polite');
  if (selectedPoint) renderPointDetails(details, selectedPoint);

  layout.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest<HTMLButtonElement>('[data-map-point]');
    if (!button) return;
    const point = visiblePoints.find(({ id }) => id === button.dataset.mapPoint);
    if (!point) return;

    selectedPointId = point.id;
    for (const control of layout.querySelectorAll<HTMLButtonElement>('[data-map-point]')) {
      control.setAttribute('aria-pressed', String(control.dataset.mapPoint === point.id));
    }
    renderPointDetails(details, point);
  });

  layout.append(mapPanel, details);
  const note = document.createElement('p');
  note.className = 'case-map__precision-note';
  note.textContent = t('cases.map.precisionNote');
  section.append(heading, legend, layout, note);
  return section;
}

function createMapStage(points: readonly CaseMapPoint[], selectedId: string | undefined): HTMLElement {
  const stage = document.createElement('div');
  stage.className = 'case-map__stage';
  const world = document.createElement('img');
  world.className = 'case-map__world';
  world.src = worldMapUrl;
  world.alt = '';
  world.width = 1000;
  world.height = 570;
  world.loading = 'lazy';
  world.decoding = 'async';
  world.fetchPriority = 'low';
  world.setAttribute('aria-hidden', 'true');
  stage.appendChild(world);

  for (const point of points) {
    const variant = getPointVariant(point);
    const label = getPointLabel(point);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `case-map__point case-map__point--${variant}`;
    button.style.left = `${point.x}%`;
    button.style.top = `${point.y}%`;
    button.dataset.mapPoint = point.id;
    button.setAttribute('aria-controls', DETAILS_ID);
    button.setAttribute('aria-pressed', String(point.id === selectedId));
    button.setAttribute('aria-label', label);
    button.title = label;
    const pointLabel = document.createElement('span');
    pointLabel.className = `case-map__point-label case-map__point-label--${point.labelSide}`;
    pointLabel.textContent = getPointDisplayName(point);
    pointLabel.setAttribute('aria-hidden', 'true');
    button.appendChild(pointLabel);
    stage.appendChild(button);
  }
  return stage;
}

function createPointSelector(
  points: readonly CaseMapPoint[],
  selectedId: string | undefined,
): HTMLUListElement {
  const selector = document.createElement('ul');
  selector.className = 'case-map__point-selector';
  selector.setAttribute('aria-label', t('cases.map.selectorLabel'));

  for (const point of points) {
    const item = document.createElement('li');
    const button = document.createElement('button');
    const variant = getPointVariant(point);
    button.type = 'button';
    button.className = `case-map__selector-button case-map__selector-button--${variant}`;
    button.dataset.mapPoint = point.id;
    button.setAttribute('aria-controls', DETAILS_ID);
    button.setAttribute('aria-pressed', String(point.id === selectedId));
    button.setAttribute('aria-label', getPointLabel(point));
    const mark = document.createElement('span');
    mark.className = 'case-map__selector-mark';
    mark.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.textContent = getPointDisplayName(point);
    button.append(mark, label);
    item.appendChild(button);
    selector.appendChild(item);
  }

  return selector;
}

function getPointDisplayName(point: CaseMapPoint): string {
  return point.type === 'market-coverage'
    ? td(point, 'name')
    : td(point, 'label');
}

function getPointLabel(point: CaseMapPoint): string {
  if (point.type === 'market-coverage') {
    return `${t('cases.map.legend.coverage')}: ${td(point, 'name')}. ${t('cases.map.precision.country')}`;
  }

  const project = requireProject(point.projectId);
  return `${t('cases.map.legend.project')}: ${td(project, 'name')}. ${getPrecisionLabel(project)}`;
}

function renderPointDetails(container: HTMLElement, point: CaseMapPoint): void {
  container.replaceChildren();
  const variant = getPointVariant(point);
  const type = document.createElement('p');
  type.className = `case-map__type case-map__type--${variant}`;
  type.textContent = t(`cases.map.legend.${variant === 'verified' ? 'project' : 'coverage'}`);

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

function getPointVariant(point: CaseMapPoint): 'verified' | 'coverage' {
  switch (point.type) {
    case 'verified-case':
      return 'verified';
    case 'market-coverage':
      return 'coverage';
  }
}

function requireProject(projectId: string): Project {
  const project = getProjectById(projectId);
  if (!project) throw new Error(`Unknown case map project "${projectId}"`);
  return project;
}
