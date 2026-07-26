import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

test('industry applications expose six multilingual placeholder records and safe cross-links', async () => {
  const html = await read('industries/index.html');
  assert.match(html, /src="\/src\/pages\/industries\/index\.ts"/);

  const industries = JSON.parse(await read('src/data/industries.json'));
  assert.deepEqual(
    industries.map(({ id }) => id),
    ['steel', 'chemical', 'power', 'pharmaceutical', 'defence', 'special-facilities'],
  );

  for (const industry of industries) {
    assert.equal(industry.status, 'example-placeholder', industry.id);
    for (const field of ['name', 'summary', 'environment', 'challenge', 'response']) {
      assert.ok(industry[field], `${industry.id}.${field}`);
      assert.ok(industry[`${field}_zh`], `${industry.id}.${field}_zh`);
      assert.ok(industry[`${field}_ru`], `${industry.id}.${field}_ru`);
    }
    assert.ok(industry.equipment.length > 0, `${industry.id}.equipment`);
    assert.ok(industry.relatedCases.length > 0, `${industry.id}.relatedCases`);
  }

  const page = await read('src/pages/industries/index.ts');
  assert.match(page, /basePath\(`\/products\/\?id=\$\{equipment\.productId\}`\)/);
  assert.match(page, /basePath\(`\/cases\/\?id=\$\{relatedCase\.id\}`\)/);
  assert.match(page, /industry\.status === 'example-placeholder'/);

  for (const locale of ['en', 'zh', 'ru']) {
    const messages = JSON.parse(await read(`src/i18n/locales/${locale}.json`));
    for (const key of [
      'industries.status.example',
      'industries.environment',
      'industries.challenge',
      'industries.response',
      'industries.equipment',
      'industries.cases',
    ]) {
      assert.ok(messages[key], `${locale}:${key}`);
    }
  }
});
