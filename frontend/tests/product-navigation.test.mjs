import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

test('product navigation provides a reusable, explicitly labelled detail contract', async () => {
  const products = JSON.parse(await read('src/data/products.json'));
  const series = JSON.parse(await read('src/data/product-series.json'));

  assert.ok(series.length >= 4);
  assert.ok(products.length > 0);
  assert.equal(new Set(products.map(({ id }) => id)).size, products.length);

  for (const product of products) {
    assert.match(product.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(series.some(({ id }) => id === product.group));
    assert.equal(product.contentStatus, 'example-placeholder');
    for (const field of ['name', 'name_zh', 'name_ru', 'description', 'description_zh', 'description_ru', 'image']) {
      assert.ok(product[field], `${product.id}.${field}`);
    }
  }

  const detailedProduct = products.find(({ features, parameters, industries, downloads }) =>
    features?.length && parameters?.length && industries?.length && downloads?.length,
  );
  assert.ok(detailedProduct, 'at least one product must exercise every detail section');
  assert.ok(detailedProduct.features.every((item) => item.text && item.text_zh && item.text_ru));
  assert.ok(detailedProduct.parameters.every((item) =>
    item.label && item.label_zh && item.label_ru && item.value && item.value_zh && item.value_ru,
  ));
  assert.ok(detailedProduct.industries.every((item) => item.id && item.name && item.name_zh && item.name_ru));
  assert.ok(detailedProduct.downloads.every((item) =>
    item.title && item.title_zh && item.title_ru && item.status === 'pending-replacement',
  ));

  const listing = await read('src/pages/products/index.ts');
  assert.match(listing, /basePath\(`\/products\/detail\/\?id=\$\{encodeURIComponent\(product\.id\)\}`\)/);
  assert.match(listing, /product\.contentStatus/);

  const detail = await read('src/pages/products/detail/index.ts');
  assert.match(detail, /new URLSearchParams\(window\.location\.search\)\.get\('id'\)/);
  assert.match(detail, /createNotFound/);
  assert.match(detail, /basePath\('\/products\/'\)/);
  assert.match(detail, /basePath\('\/contact\/'\)/);
  assert.match(detail, /basePath\(`\/industries\/#industry-\$\{encodeURIComponent\(industry\.id\)\}`\)/);

  const detailHtml = await read('products/detail/index.html');
  assert.match(detailHtml, /src="\/src\/pages\/products\/detail\/index\.ts"/);

  const viteConfig = await read('vite.config.ts');
  assert.match(viteConfig, /productsDetail: resolve\(__dirname, 'products\/detail\/index\.html'\)/);

  for (const locale of ['en', 'zh', 'ru']) {
    const messages = JSON.parse(await read(`src/i18n/locales/${locale}.json`));
    for (const key of [
      'products.status.verified-content',
      'products.status.example-placeholder',
      'products.status.pending-replacement',
      'products.detail.features',
      'products.detail.parameters',
      'products.detail.industries',
      'products.detail.downloads',
      'products.notFound.title',
      'products.notFound.back',
    ]) {
      assert.ok(messages[key], `${locale}: ${key}`);
    }
  }
});
