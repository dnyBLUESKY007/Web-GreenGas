import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

test('news archive preserves official records and homepage-ready featured data', async () => {
  const articles = JSON.parse(await read('src/data/news.json'));
  const imageResources = JSON.parse(await read('src/data/image-resources.json'));
  const expectedRecords = [
    ['industrial-air-conditioning-features', '2025-11-20', 'industry', 'https://cn.greennb.com/id46737575.html'],
    ['iso9001-certification', '2020-12-18', 'company', 'https://cn.greennb.com/id40837575.html'],
    ['ce-certification', '2020-12-12', 'company', 'https://cn.greennb.com/zhuhewosichanpintongguobinghuodecerenzheng.html'],
    ['shanghai-refrigeration-expo-2019', '2020-08-24', 'industry', 'https://cn.greennb.com/id3426212.html'],
    ['australian-client-visit', '2020-07-29', 'company', 'https://cn.greennb.com/id3836212.html'],
    ['meltblown-fabric-workshop-delivery', '2020-07-20', 'company', 'https://cn.greennb.com/id3726212.html'],
  ];

  assert.deepEqual(
    articles.map(({ id, date, category, sourceUrl }) => [id, date, category, sourceUrl]),
    expectedRecords,
  );
  assert.deepEqual([...new Set(articles.map(({ category }) => category))].sort(), ['company', 'industry']);
  assert.deepEqual(
    articles.filter(({ featured }) => featured).map(({ id }) => id),
    ['industrial-air-conditioning-features', 'iso9001-certification', 'ce-certification'],
  );

  for (const article of articles) {
    assert.match(article.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.match(article.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(article.title && article.title_zh && article.title_ru, `${article.id}: titles`);
    assert.ok(article.excerpt && article.excerpt_zh && article.excerpt_ru, `${article.id}: excerpts`);
    assert.ok(article.paragraphs.length > 0, `${article.id}: English body`);
    assert.equal(article.paragraphs_zh.length, article.paragraphs.length, `${article.id}: Chinese body`);
    assert.equal(article.paragraphs_ru.length, article.paragraphs.length, `${article.id}: Russian body`);
    assert.ok(article.images.length > 0, `${article.id}: images`);
    for (const image of article.images) {
      const url = `https://web-greengas.oss-cn-qingdao.aliyuncs.com/resources/${image.category}/${image.filename}`;
      assert.ok(imageResources[url], `${article.id}: registered image ${url}`);
      assert.ok(image.alt && image.alt_zh && image.alt_ru, `${article.id}: image alt text`);
    }
  }

  assert.equal(articles.find(({ id }) => id === 'iso9001-certification').paragraphs_zh.length, 4);
  assert.equal(articles.find(({ id }) => id === 'meltblown-fabric-workshop-delivery').paragraphs_zh.length, 3);
});

test('news list and generic detail expose required behavior', async () => {
  const [listPage, detailPage, styles] = await Promise.all([
    read('src/pages/news/index.ts'),
    read('src/pages/news/detail/index.ts'),
    read('src/styles/components/_news-page.scss'),
  ]);

  for (const field of ['date', 'category']) {
    assert.match(listPage, new RegExp(`item\\.${field}`));
  }
  assert.match(listPage, /td\(item, 'title'\)/);
  assert.match(listPage, /td\(item, 'excerpt'\)/);
  assert.match(listPage, /item\.images\[0\]/);
  assert.match(listPage, /basePath\('\/news\/detail\/'\)/);
  assert.match(listPage, /encodeURIComponent\(item\.id\)/);
  assert.match(listPage, /\['all', 'company', 'industry'\]/);

  assert.match(detailPage, /new URLSearchParams\(window\.location\.search\)\.get\('id'\)/);
  assert.match(detailPage, /article \? createArticle\(article\) : createNotFound\(\)/);
  assert.match(detailPage, /basePath\('\/news\/'\)/);
  assert.match(detailPage, /news\.notFound\.title/);
  assert.match(detailPage, /news\.notFound\.desc/);

  assert.match(styles, /@media \(width >= \$breakpoint-md\)/);
  assert.match(styles, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
});
