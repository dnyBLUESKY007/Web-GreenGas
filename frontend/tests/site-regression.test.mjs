import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

async function readJson(relativePath) {
  return JSON.parse(await read(relativePath));
}

test('all locales expose the same non-empty interface contract', async () => {
  const locales = Object.fromEntries(
    await Promise.all(
      ['en', 'zh', 'ru'].map(async (locale) => [locale, await readJson(`src/i18n/locales/${locale}.json`)]),
    ),
  );
  const expectedKeys = Object.keys(locales.en).sort();

  for (const [locale, messages] of Object.entries(locales)) {
    assert.deepEqual(Object.keys(messages).sort(), expectedKeys, `${locale} locale keys`);
    for (const [key, value] of Object.entries(messages)) {
      assert.ok(value.trim(), `${locale}:${key}`);
    }
  }
});

test('cross-page references resolve or remain visibly non-interactive placeholders', async () => {
  const [products, industries, projects, industryPage, productDetail] = await Promise.all([
    readJson('src/data/products.json'),
    readJson('src/data/industries.json'),
    readJson('src/data/projects.json'),
    read('src/pages/industries/index.ts'),
    read('src/pages/products/detail/index.ts'),
  ]);
  const productIds = new Set(products.map(({ id }) => id));
  const industryIds = new Set(industries.map(({ id }) => id));
  const projectIds = new Set(projects.map(({ id }) => id));

  for (const industry of industries) {
    for (const equipment of industry.equipment) {
      assert.ok(productIds.has(equipment.productId), `${industry.id} -> product ${equipment.productId}`);
    }
  }

  for (const product of products) {
    for (const industry of product.industries ?? []) {
      assert.ok(industryIds.has(industry.id), `${product.id} -> industry ${industry.id}`);
    }
  }

  assert.match(industryPage, /const projectIds = new Set/);
  assert.match(industryPage, /projectIds\.has\(relatedCase\.id\)/);
  assert.match(industryPage, /if \(href\)/);
  assert.match(industryPage, /document\.createElement\('span'\)/);
  assert.ok(
    industries.some((industry) => industry.relatedCases.some(({ id }) => !projectIds.has(id))),
    'the example related-case placeholder path must remain exercised',
  );
  assert.match(productDetail, /basePath\(`\/industries\/#industry-\$\{encodeURIComponent\(industry\.id\)\}`\)/);
});

test('global interactions are localized and safe for motion, fragments, and long copy', async () => {
  const [navbar, switcher, carousel, contact, imageFallback, cards, newsStyles] = await Promise.all([
    read('src/components/navbar/Navbar.ts'),
    read('src/components/lang-switcher/LangSwitcher.ts'),
    read('src/components/hero-carousel/HeroCarousel.ts'),
    read('src/pages/contact/index.ts'),
    read('src/utils/initImageFallback.ts'),
    read('src/styles/components/_cards.scss'),
    read('src/styles/components/_news-page.scss'),
  ]);

  assert.match(navbar, /t\('nav\.main\.label'\)/);
  assert.match(switcher, /t\('nav\.language\.group'\)/);
  assert.match(carousel, /matchMedia\('\(prefers-reduced-motion: reduce\)'\)/);
  assert.match(carousel, /aria-current/);
  assert.match(carousel, /container\.addEventListener\('focusin'/);
  assert.match(carousel, /container\.addEventListener\('focusout'/);
  assert.match(contact, /location\.hash === '#faq'/);
  assert.match(contact, /faqSection\.scrollIntoView\(\)/);
  assert.match(imageFallback, /event\.target/);
  assert.match(imageFallback, /instanceof HTMLImageElement/);
  assert.match(imageFallback, /getAttribute\('aria-hidden'\) === 'true'/);
  assert.match(imageFallback, /t\('media\.unavailable'\)/);

  assert.doesNotMatch(cards, /\$news-card-height|height: \$news-card-height/);
  assert.match(cards, /grid-template-columns: minmax\(0, 30%\) minmax\(0, 1fr\)/);
  assert.doesNotMatch(newsStyles, /position: absolute/);
});

test('public data does not hotlink competitor assets', async () => {
  const dataFiles = [
    'src/data/company.json',
    'src/data/industries.json',
    'src/data/news.json',
    'src/data/products.json',
    'src/data/projects.json',
    'src/data/technical-support.json',
  ];
  const serializedData = (await Promise.all(dataFiles.map(read))).join('\n');

  assert.doesNotMatch(serializedData, /refindustry|competitor/i);
});
