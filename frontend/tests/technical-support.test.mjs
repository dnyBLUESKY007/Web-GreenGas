import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

test('technical support exposes truthful categorized metadata and safe downloads', async () => {
  const data = JSON.parse(await read('src/data/technical-support.json'));
  const expectedCategories = [
    'manuals',
    'product-samples',
    'installation',
    'commissioning',
    'maintenance',
    'troubleshooting',
    'pre-sales',
    'after-sales',
  ];

  assert.deepEqual(data.categories.map(({ id }) => id), expectedCategories);
  assert.equal(new Set(data.categories.map(({ id }) => id)).size, data.categories.length);
  assert.ok(data.documents.length > 0, 'the library should demonstrate its metadata contract');
  assert.equal(new Set(data.documents.map(({ id }) => id)).size, data.documents.length);

  for (const category of data.categories) {
    assert.ok(category.name && category.name_zh && category.name_ru, `${category.id} labels`);
  }

  for (const document of data.documents) {
    assert.ok(document.id);
    assert.ok(document.title && document.title_zh && document.title_ru, `${document.id} title`);
    assert.ok(expectedCategories.includes(document.category), `${document.id} category`);
    assert.ok(document.relatedProduct && document.relatedProduct_zh && document.relatedProduct_ru);
    assert.ok(document.language && document.language_zh && document.language_ru);
    assert.ok(document.fileType);
    assert.ok(document.versionOrDate && document.versionOrDate_zh && document.versionOrDate_ru);
    assert.ok(['verified-content', 'example-placeholder', 'pending-replacement'].includes(document.contentStatus));
    assert.ok(['approved', 'review-required', 'unavailable'].includes(document.publicationStatus));
    assert.ok(['verified', 'unverified'].includes(document.availabilityStatus));

    if (document.downloadUrl) {
      const url = new URL(document.downloadUrl);
      assert.equal(document.publicationStatus, 'approved');
      assert.equal(document.availabilityStatus, 'verified');
      assert.equal(url.protocol, 'https:');
      assert.match(url.hostname, /\.oss-[a-z0-9-]+\.aliyuncs\.com$/);
    }
  }

  assert.ok(
    data.documents.some(({ contentStatus }) => contentStatus === 'example-placeholder'),
    'an example entry must exercise the visible placeholder state',
  );

  const supportPage = await read('src/pages/support/index.ts');
  assert.match(supportPage, /technical-support\.json/);
  assert.match(supportPage, /import \{ CDN_BASE \} from '@\/config\/assets'/);
  assert.match(supportPage, /contentStatus === 'example-placeholder'/);
  assert.match(supportPage, /publicationStatus !== 'approved'/);
  assert.match(supportPage, /availabilityStatus !== 'verified'/);
  assert.match(supportPage, /url\.hostname === new URL\(CDN_BASE\)\.hostname/);
  assert.match(supportPage, /new URL\(technicalDocument\.downloadUrl\)/);
  assert.match(supportPage, /aria-pressed/);
  assert.match(supportPage, /aria-live/);
  assert.match(supportPage, /filter\.setAttribute\('role', 'group'\)/);
  assert.match(supportPage, /link\.setAttribute\('aria-label'/);
  assert.match(supportPage, /focusActiveFilter/);
  assert.match(supportPage, /support\.empty/);

  const html = await read('support/index.html');
  assert.match(html, /src="\/src\/pages\/support\/index\.ts"/);

  const requiredKeys = [
    'support.title',
    'support.desc',
    'support.filter.all',
    'support.example',
    'support.meta.category',
    'support.meta.product',
    'support.meta.language',
    'support.meta.fileType',
    'support.meta.versionOrDate',
    'support.download',
    'support.unavailable',
    'support.empty',
  ];
  for (const locale of ['en', 'zh', 'ru']) {
    const messages = JSON.parse(await read(`src/i18n/locales/${locale}.json`));
    for (const key of requiredKeys) {
      assert.ok(messages[key], `${locale} is missing ${key}`);
    }
  }

  const styles = await read('src/styles/components/_support-page.scss');
  assert.match(styles, /width >= \$breakpoint-md/);
  assert.match(styles, /width >= \$breakpoint-lg/);
  assert.match(styles, /overflow-wrap: anywhere/);
});
