import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

test('case center provides sourced filterable cases and a recoverable generic detail', async () => {
  const projects = JSON.parse(await read('src/data/projects.json'));
  assert.deepEqual(
    projects.map(({ id }) => id),
    [
      'haoda-tools-hvac',
      'liaoning-port-cooling',
      'south-africa-three-stage-cooling',
      'queensland-medical-research',
    ],
  );

  for (const project of projects) {
    assert.equal(project.status, 'verified');
    assert.match(project.sourceUrl, /^https:\/\/cn\.greennb\.com\//);
    assert.ok(project.industryKey);
    assert.ok(project.regionKey);
    assert.ok(['country', 'province', 'unspecified'].includes(project.geography.precision));
    assert.ok(project.equipment);
    assert.ok(project.context);
    assert.ok(project.challenge);
    assert.ok(project.response);
    assert.ok(Array.isArray(project.images) && project.images.length > 0);
    assert.ok(Array.isArray(project.relatedCaseIds));
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
