import '@/styles/main.scss';
import { createCaseMap } from '@/components/case-map/CaseMap';
import { createProjectCard } from '@/components/project-card/ProjectCard';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { projects } from '@/data/projects';
import { t, td } from '@/i18n';
import { initPage } from '@/utils/mountLayout';

let activeIndustry = 'all';
let activeRegion = 'all';

function renderCasesPage(): void {
  const main = document.getElementById('page-content');
  if (!main) return;

  const header = document.createElement('section');
  header.className = 'page-header';
  header.appendChild(
    createSectionTitle({
      eyebrow: t('cases.eyebrow'),
      title: t('destination.cases.title'),
      description: t('destination.cases.desc'),
    }),
  );

  const section = document.createElement('section');
  section.className = 'section cases-list';
  const container = document.createElement('div');
  container.className = 'container';
  const filteredProjects = getFilteredProjects();
  container.append(
    createCaseMap(new Set(filteredProjects.map(({ id }) => id))),
    createFilters(),
    createCaseResults(filteredProjects),
  );
  section.appendChild(container);
  main.replaceChildren(header, section);
}

function createFilters(): HTMLElement {
  const filters = document.createElement('div');
  filters.className = 'case-filter';
  filters.setAttribute('aria-label', t('cases.filter.label'));
  filters.append(
    createFilterSelect('industry', activeIndustry, getIndustryOptions(), (value) => {
      activeIndustry = value;
    }),
    createFilterSelect('region', activeRegion, getRegionOptions(), (value) => {
      activeRegion = value;
    }),
  );
  return filters;
}

function createFilterSelect(
  filter: 'industry' | 'region',
  currentValue: string,
  options: ReadonlyMap<string, string>,
  updateValue: (value: string) => void,
): HTMLElement {
  const field = document.createElement('label');
  field.className = 'case-filter__field';
  const label = document.createElement('span');
  label.className = 'case-filter__label';
  label.textContent = t(`cases.filter.${filter}`);

  const select = document.createElement('select');
  select.className = 'case-filter__select';
  select.value = currentValue;
  for (const [value, text] of options) {
    select.add(new Option(text, value, false, value === currentValue));
  }
  select.addEventListener('change', () => {
    updateValue(select.value);
    renderCasesPage();
  });

  field.append(label, select);
  return field;
}

function getIndustryOptions(): ReadonlyMap<string, string> {
  const options = new Map<string, string>([['all', t('cases.filter.allIndustries')]]);
  for (const project of projects) {
    options.set(project.industryKey, td(project, 'industry'));
  }
  return options;
}

function getRegionOptions(): ReadonlyMap<string, string> {
  const options = new Map<string, string>([['all', t('cases.filter.allRegions')]]);
  for (const project of projects) {
    options.set(project.regionKey, t(`cases.region.${project.regionKey}`));
  }
  return options;
}

function getFilteredProjects(): typeof projects {
  return projects.filter(
    (project) =>
      (activeIndustry === 'all' || project.industryKey === activeIndustry) &&
      (activeRegion === 'all' || project.regionKey === activeRegion),
  );
}

function createCaseResults(filteredProjects: typeof projects): HTMLElement {
  const results = document.createElement('div');
  results.className = 'case-results';

  const count = document.createElement('p');
  count.className = 'case-results__count';
  count.setAttribute('aria-live', 'polite');
  count.textContent = t('cases.results').replace('{count}', String(filteredProjects.length));
  results.appendChild(count);

  if (filteredProjects.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'case-results__empty';
    empty.textContent = t('cases.empty');
    results.appendChild(empty);
    return results;
  }

  const grid = document.createElement('div');
  grid.className = 'grid grid--projects';
  for (const project of filteredProjects) {
    const card = createProjectCard(project);
    card.id = `case-card-${project.id}`;
    grid.appendChild(card);
  }
  results.appendChild(grid);
  return results;
}

initPage('cases', renderCasesPage);
