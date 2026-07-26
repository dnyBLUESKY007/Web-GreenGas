import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

test('homepage follows the approved structured-content order and preserves statuses', async () => {
  const home = await read('src/pages/home/index.ts');
  const mountedSections = [
    'hero',
    'heroIntro',
    'productGrid',
    'industryPreview',
    'caseCarousel',
    'clientLogos',
    'newsPreview',
    'serviceStrip',
    'aboutSummary',
  ];
  const replaceChildren = home.match(/main\.replaceChildren\(([\s\S]*?)\);/)?.[1] ?? '';
  let previousIndex = -1;
  for (const section of mountedSections) {
    const sectionIndex = replaceChildren.indexOf(section);
    assert.ok(sectionIndex > previousIndex, `${section} should follow the approved homepage order`);
    previousIndex = sectionIndex;
  }
  assert.doesNotMatch(home, /renderSolutions|createCapabilityBand/);
  assert.match(home, /createClientLogos\(true\)/);

  const heroIntro = await read('src/components/hero-intro/HeroIntro.ts');
  assert.match(heroIntro, /companyData/);
  assert.match(heroIntro, /profile\.paragraphs/);
  assert.doesNotMatch(heroIntro, /home\.heroIntro\.text/);

  const componentContracts = [
    ['src/components/product-grid/ProductGrid.ts', /products\.json/, /product\.contentStatus/, /products\/detail/, /basePath/],
    ['src/components/industry-preview/IndustryPreview.ts', /industries\.json/, /industry\.status/, /industries\.status\.example/, /basePath\('\/industries\/'\)/],
    ['src/components/case-carousel/CaseCarousel.ts', /data\/projects/, /project\.status/, /basePath\('\/cases\/'\)/, /cases\/detail/],
    ['src/components/client-logos/ClientLogos.ts', /clients\.json/, /partnerGroup\.status/, /basePath\('\/about\/clients\/'\)/],
    ['src/components/news-preview/NewsPreview.ts', /news\.json/, /\.filter\(\(article\) => article\.featured\)/, /basePath\('\/news\/'\)/, /news\/detail/],
    ['src/components/service-strip/ServiceStrip.ts', /technical-support\.json/, /contentStatus/, /publicationStatus/, /basePath\('\/support\/'\)/],
    ['src/components/about-summary/AboutSummary.ts', /company\.json/, /renderContactChannels/, /createSummaryLink\('\/about\/'/, /createSummaryLink\('\/contact\/'/, /basePath\(path\)/],
  ];

  for (const [path, ...patterns] of componentContracts) {
    const source = await read(path);
    for (const pattern of patterns) assert.match(source, pattern, `${path} should satisfy ${pattern}`);
  }

  const company = JSON.parse(await read('src/data/company.json'));
  assert.match(company.profile.paragraphs_zh[0], /^宁波格灵空调科技有限公司是集设计开发/);

  const news = JSON.parse(await read('src/data/news.json'));
  assert.equal(news.filter((article) => article.featured).length, 3);

  const support = JSON.parse(await read('src/data/technical-support.json'));
  assert.ok(support.documents.every((document) => document.downloadUrl === null));
});

test('homepage additions are translated and responsive without clipping long copy', async () => {
  const keys = [
    'home.industries.title',
    'home.industries.desc',
    'home.industries.more',
    'home.cases.more',
    'home.clients.more',
    'home.news.title',
    'home.news.desc',
    'home.news.more',
    'home.support.title',
    'home.support.desc',
    'home.support.more',
    'home.about.more',
    'home.about.contactMore',
  ];

  for (const locale of ['en', 'zh', 'ru']) {
    const messages = JSON.parse(await read(`src/i18n/locales/${locale}.json`));
    for (const key of keys) assert.ok(messages[key]?.trim(), `${locale} is missing ${key}`);
  }

  const styles = await read('src/styles/components/_home-previews.scss');
  assert.match(styles, /grid-template-columns: 1fr/);
  assert.match(styles, /width >= \$breakpoint-sm/);
  assert.match(styles, /width >= \$breakpoint-md/);
  assert.match(styles, /width >= \$breakpoint-lg/);
  assert.match(styles, /overflow-wrap: anywhere/);
  assert.match(styles, /min-height: 2\.75rem/);
  assert.doesNotMatch(styles, /^\s*height:\s*\d/m);
});
