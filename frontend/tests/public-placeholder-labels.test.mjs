import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('public status labels are reserved for placeholder or replacement content', async () => {
  const expectedProjectLabels = {
    en: 'Project point',
    zh: '案例项目点',
    ru: 'Точка проекта',
  };

  for (const [locale, projectLabel] of Object.entries(expectedProjectLabels)) {
    const messages = JSON.parse(await read(`src/i18n/locales/${locale}.json`));
    assert.equal(messages['cases.map.legend.project'], projectLabel);
    assert.equal(messages['cases.map.legend.verified'], undefined);
    assert.equal(messages['products.status.verified-content'], undefined);
    assert.equal(messages['home.clients.status.verified-content'], undefined);
  }

  const productStatus = await read('src/components/product-status/ProductStatus.ts');
  assert.match(productStatus, /status === 'verified-content'/);
  assert.match(productStatus, /return undefined/);

  const partnerLogos = await read('src/components/client-logos/ClientLogos.ts');
  assert.match(partnerLogos, /partnerGroup\.status !== 'verified-content'/);

  const serviceStrip = await read('src/components/service-strip/ServiceStrip.ts');
  assert.match(serviceStrip, /filter\(Boolean\)/);
  assert.doesNotMatch(serviceStrip, /return status/);

  for (const path of [
    'src/pages/industries/index.ts',
    'src/components/industry-preview/IndustryPreview.ts',
  ]) {
    const industryRenderer = await read(path);
    assert.match(industryRenderer, /status === 'example-placeholder'/);
    assert.doesNotMatch(industryRenderer, /: industry\.status|return status/);
  }
});
