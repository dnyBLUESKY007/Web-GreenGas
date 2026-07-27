import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

test('case center provides sourced filterable cases and a recoverable generic detail', async () => {
  const projects = JSON.parse(await read('src/data/projects.json'));
  const projectIds = new Set(projects.map(({ id }) => id));
  assert.deepEqual(
    [...projectIds],
    [
      'haoda-tools-hvac',
      'netcare-pinehaven-hospital',
      'mauritania-parliament-hvac',
      'brisbane-airport-air-handling',
    ],
  );
  assert.equal(projectIds.size, projects.length, 'project IDs must be unique');
  assert.ok(projects.every((project) => project.sourceUrl === undefined));
  assert.deepEqual(
    projects.find(({ id }) => id === 'haoda-tools-hvac').geography,
    { precision: 'unspecified' },
  );

  const localizedFields = [
    'name',
    'industry',
    'location',
    'equipment',
    'summary',
  ];

  const optionalLocalizedFields = ['context', 'challenge', 'response', 'result'];
  const expectedImages = new Map([
    ['haoda-tools-hvac', ['haoda-tools', 5]],
    ['netcare-pinehaven-hospital', ['netcare-pinehaven', 5]],
    ['mauritania-parliament-hvac', ['mauritania-parliament', 4]],
    ['brisbane-airport-air-handling', ['brisbane-airport', 9]],
  ]);

  for (const project of projects) {
    assert.equal(project.status, 'verified');
    if (project.sourceUrl) {
      assert.equal(new URL(project.sourceUrl).protocol, 'https:');
    }
    assert.ok(project.industryKey);
    assert.ok(project.regionKey);
    assert.ok(['country', 'province', 'unspecified'].includes(project.geography.precision));
    assert.ok(Array.isArray(project.images) && project.images.length > 0);
    assert.ok(Array.isArray(project.relatedCaseIds));
    for (const field of localizedFields) {
      assert.ok(project[field], `${project.id}: ${field}`);
      assert.ok(project[`${field}_zh`], `${project.id}: ${field}_zh`);
      assert.ok(project[`${field}_ru`], `${project.id}: ${field}_ru`);
    }
    for (const field of optionalLocalizedFields) {
      if (project[field] === undefined) continue;
      assert.ok(project[field], `${project.id}: ${field}`);
      assert.ok(project[`${field}_zh`], `${project.id}: ${field}_zh`);
      assert.ok(project[`${field}_ru`], `${project.id}: ${field}_ru`);
    }
    const expectedImage = expectedImages.get(project.id);
    assert.ok(expectedImage, `${project.id}: image contract`);
    const [imageStem, imageCount] = expectedImage;
    assert.equal(project.images.length, imageCount, `${project.id}: image count`);
    assert.equal(
      project.images[0].filename,
      `stakeholder-cases-2026/${imageStem}-01.webp`,
      `${project.id}: primary image`,
    );
    for (const image of project.images) {
      assert.match(image.filename, new RegExp(`^stakeholder-cases-2026/${imageStem}-\\d{2}\\.webp$`));
      assert.ok(image.alt);
      assert.ok(image.alt_zh);
      assert.ok(image.alt_ru);
    }
    for (const relatedCaseId of project.relatedCaseIds) {
      assert.notEqual(relatedCaseId, project.id);
      assert.ok(projectIds.has(relatedCaseId), `${project.id}: unknown related case ${relatedCaseId}`);
    }
    assert.doesNotMatch(JSON.stringify(project), /12,000|32%|Shenzhen|Shanghai|Guangzhou/);
  }

  const casesHtml = await read('cases/index.html');
  const detailHtml = await read('cases/detail/index.html');
  assert.ok(detailHtml.startsWith('<!doctype html>'));
  assert.match(casesHtml, /src="\/src\/pages\/cases\/index\.ts"/);
  assert.match(detailHtml, /src="\/src\/pages\/cases\/detail\/index\.ts"/);

  const listPage = await read('src/pages/cases/index.ts');
  assert.match(listPage, /case-filter__select/);
  assert.match(listPage, /industryKey/);
  assert.match(listPage, /regionKey/);
  assert.match(listPage, /createProjectCard/);

  const detailPage = await read('src/pages/cases/detail/index.ts');
  assert.match(detailPage, /new URLSearchParams\(window\.location\.search\)\.get\('id'\)/);
  assert.match(detailPage, /createNotFound/);
  assert.match(detailPage, /relatedCaseIds/);
  assert.match(detailPage, /basePath\('\/cases\/'\)/);
  assert.match(detailPage, /createOptionalDetailSection/);
  assert.match(detailPage, /project\.sourceUrl \?/);

  const viteConfig = await read('vite.config.ts');
  assert.match(viteConfig, /casesDetail: resolve\(__dirname, 'cases\/detail\/index\.html'\)/);

  const requiredMessages = [
    'cases.filter.industry',
    'cases.filter.region',
    'cases.status.verified',
    'cases.detail.challenge',
    'cases.detail.response',
    'cases.notFound.title',
  ];
  for (const locale of ['en', 'zh', 'ru']) {
    const messages = JSON.parse(await read(`src/i18n/locales/${locale}.json`));
    for (const key of requiredMessages) {
      assert.ok(messages[key], `${locale}: ${key}`);
    }
  }
});

test('case map separates sourced projects from country-level market coverage', async () => {
  const projects = JSON.parse(await read('src/data/projects.json'));
  const points = JSON.parse(await read('src/data/case-map.json'));
  const projectById = new Map(projects.map((project) => [project.id, project]));
  const pointIds = new Set(points.map(({ id }) => id));

  assert.equal(pointIds.size, points.length, 'map point IDs must be unique');
  assert.deepEqual(
    points.filter(({ type }) => type === 'verified-case').map(({ projectId }) => projectId),
    ['netcare-pinehaven-hospital', 'mauritania-parliament-hvac', 'brisbane-airport-air-handling'],
  );
  assert.deepEqual(
    points.filter(({ type }) => type === 'market-coverage').map(({ countryCode }) => countryCode),
    ['ZA', 'AU', 'KR', 'RU'],
  );

  for (const point of points) {
    assert.ok(point.x >= 0 && point.x <= 100, `${point.id}: x outside map`);
    assert.ok(point.y >= 0 && point.y <= 100, `${point.id}: y outside map`);

    if (point.type === 'verified-case') {
      const project = projectById.get(point.projectId);
      assert.ok(project, `${point.id}: unknown project ${point.projectId}`);
      assert.notEqual(project.geography.precision, 'unspecified');
      assert.equal(point.countryCode, project.geography.countryCode);
      assert.equal('name' in point, false, `${point.id}: project copy must come from projects.json`);
      continue;
    }

    assert.equal(point.type, 'market-coverage');
    assert.equal(point.scope, 'country');
    assert.equal(point.source, 'formal-company-profile');
    assert.equal('projectId' in point, false, `${point.id}: coverage must not imply a case`);
    for (const field of ['name', 'name_zh', 'name_ru']) {
      assert.ok(point[field], `${point.id}: ${field}`);
    }
  }

  const mapData = await read('src/data/caseMap.ts');
  assert.match(mapData, /getProjectById/);
  assert.match(mapData, /precision === 'unspecified'/);

  const listPage = await read('src/pages/cases/index.ts');
  assert.match(listPage, /createCaseMap/);
  assert.match(listPage, /case-card-/);

  const component = await read('src/components/case-map/CaseMap.ts');
  assert.match(component, /createElement\('button'\)/);
  assert.match(component, /aria-controls/);
  assert.match(component, /aria-pressed/);
  assert.match(component, /basePath\('\/cases\/detail\/'\)/);
  assert.match(component, /cases\.map\.coverageOnly/);
  assert.doesNotMatch(component, /mapbox|google|amap|leaflet|openstreetmap/i);

  const styles = await read('src/styles/components/_cases-page.scss');
  assert.match(styles, /(?:case-map__point|&)--verified/);
  assert.match(styles, /(?:case-map__point|&)--coverage/);
  assert.match(styles, /min-(?:width|inline-size): 2\.75rem/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /overflow-wrap: anywhere/);

  const requiredMessages = [
    'cases.map.title',
    'cases.map.description',
    'cases.map.legend.verified',
    'cases.map.legend.coverage',
    'cases.map.coverageOnly',
    'cases.map.precision.country',
    'cases.map.precision.province',
    'cases.map.viewCase',
    'cases.map.showInList',
  ];
  for (const locale of ['en', 'zh', 'ru']) {
    const messages = JSON.parse(await read(`src/i18n/locales/${locale}.json`));
    for (const key of requiredMessages) {
      assert.ok(messages[key], `${locale}: ${key}`);
    }
  }

  const packageJson = JSON.parse(await read('package.json'));
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };
  assert.equal(
    Object.keys(dependencies).some((name) => /mapbox|leaflet|openlayers|world-atlas|d3/i.test(name)),
    false,
  );
});
