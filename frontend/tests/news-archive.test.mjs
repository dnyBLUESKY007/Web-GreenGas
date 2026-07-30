import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const FRONTEND_ROOT = new URL('../', import.meta.url);
const CDN_BASE_URL = 'https://web-greengas.oss-cn-qingdao.aliyuncs.com/resources';

async function readTextFile(relativePath) {
  return readFile(new URL(relativePath, FRONTEND_ROOT), 'utf8');
}

async function readJsonFile(relativePath) {
  return JSON.parse(await readTextFile(relativePath));
}

function getArticle(articles, id) {
  const article = articles.find((candidate) => candidate.id === id);
  assert.ok(article, `missing article ${id}`);
  return article;
}

test('news archive preserves official records and homepage-ready featured data', async () => {
  const articles = await readJsonFile('src/data/news.json');
  const imageResources = await readJsonFile('src/data/image-resources.json');
  const expectedRecords = [
    {
      id: 'company-team-building-2025',
      date: '2025-11-28',
      category: 'company',
      sourceUrl: undefined,
    },
    {
      id: 'industrial-air-conditioning-features',
      date: '2025-11-20',
      category: 'industry',
      sourceUrl: 'https://cn.greennb.com/id46737575.html',
    },
    {
      id: 'employee-health-check-2021',
      date: '2021-11-12',
      category: 'company',
      sourceUrl: undefined,
    },
    {
      id: 'china-refrigeration-expo-2021',
      date: '2021-04-13',
      category: 'industry',
      sourceUrl: undefined,
    },
    {
      id: 'iso9001-certification',
      date: '2020-12-18',
      category: 'company',
      sourceUrl: 'https://cn.greennb.com/id40837575.html',
    },
    {
      id: 'ce-certification',
      date: '2020-12-12',
      category: 'company',
      sourceUrl: 'https://cn.greennb.com/zhuhewosichanpintongguobinghuodecerenzheng.html',
    },
    {
      id: 'shanghai-refrigeration-expo-2019',
      date: '2020-08-24',
      category: 'industry',
      sourceUrl: 'https://cn.greennb.com/id3426212.html',
    },
    {
      id: 'south-africa-three-stage-evaporative-cooling',
      date: '2020-08-19',
      category: 'industry',
      sourceUrl: undefined,
    },
    {
      id: 'australian-client-visit',
      date: '2020-07-29',
      category: 'company',
      sourceUrl: 'https://cn.greennb.com/id3836212.html',
    },
    {
      id: 'meltblown-fabric-workshop-delivery',
      date: '2020-07-20',
      category: 'company',
      sourceUrl: 'https://cn.greennb.com/id3726212.html',
    },
  ];

  assert.deepEqual(
    articles.map(({ id, date, category, sourceUrl }) => ({ id, date, category, sourceUrl })),
    expectedRecords,
  );
  assert.deepEqual([...new Set(articles.map(({ category }) => category))].sort(), ['company', 'industry']);
  assert.deepEqual(
    articles.filter(({ featured }) => featured).map(({ id }) => id),
    ['industrial-air-conditioning-features', 'iso9001-certification', 'ce-certification'],
  );

  const supplementalIds = [
    'company-team-building-2025',
    'employee-health-check-2021',
    'china-refrigeration-expo-2021',
    'south-africa-three-stage-evaporative-cooling',
  ];
  for (const id of supplementalIds) {
    assert.equal(Object.hasOwn(getArticle(articles, id), 'sourceUrl'), false, `${id}: no invented source URL`);
  }

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
      const url = `${CDN_BASE_URL}/${image.category}/${image.filename}`;
      assert.ok(imageResources[url], `${article.id}: registered image ${url}`);
      assert.ok(image.alt && image.alt_zh && image.alt_ru, `${article.id}: image alt text`);
    }
  }

  assert.equal(getArticle(articles, 'iso9001-certification').paragraphs_zh.length, 4);
  assert.equal(getArticle(articles, 'meltblown-fabric-workshop-delivery').paragraphs_zh.length, 3);
  assert.match(getArticle(articles, 'company-team-building-2025').paragraphs_zh.join(''), /拔河、反应大挑战、乒乓球PK赛/);
  assert.match(getArticle(articles, 'employee-health-check-2021').paragraphs_zh[0], /切实维护员工身心健康/);
  assert.doesNotMatch(getArticle(articles, 'employee-health-check-2021').paragraphs_zh.join(''), /维修员工身心健康/);
  assert.match(getArticle(articles, 'china-refrigeration-expo-2021').paragraphs_zh[1], /涵盖暖通空调行业最新、最热门的话题/);
  assert.match(getArticle(articles, 'south-africa-three-stage-evaporative-cooling').paragraphs_zh[0], /能效比达到7\.2-7\.3/);

  const expectedNewsImages = {
    'company-team-building-2025': ['team-building-2025-02.webp', 'team-building-2025-03.webp', 'team-building-2025-01.webp'],
    'employee-health-check-2021': ['health-check-2021-01.webp', 'health-check-2021-02.webp', 'health-check-2021-03.webp', 'health-check-2021-04.webp'],
    'china-refrigeration-expo-2021': ['crh-2021-01.webp', 'crh-2021-02.webp'],
    'shanghai-refrigeration-expo-2019': ['shanghai-expo-2019-01.webp', 'shanghai-expo-2019-02.webp', 'shanghai-expo-2019-03.webp', 'shanghai-expo-2019-04.webp', 'shanghai-expo-2019-05.webp'],
    'south-africa-three-stage-evaporative-cooling': ['evaporative-cooling-2020-01.webp', 'evaporative-cooling-2020-02.webp', 'evaporative-cooling-2020-03.webp', 'evaporative-cooling-2020-04.webp', 'evaporative-cooling-2020-05.webp'],
  };
  for (const [id, filenames] of Object.entries(expectedNewsImages)) {
    const images = getArticle(articles, id).images;
    assert.deepEqual(images.map(({ filename }) => filename), filenames, `${id}: image order`);
    assert.ok(images.every(({ category }) => category === 'news-0730'), `${id}: image category`);
  }
  assert.equal(
    getArticle(articles, 'company-team-building-2025').featuredImage.filename,
    'team-building-2025-01.webp',
  );

  const expectedOriginalPaths = {
    'crh-2021-01.webp': '0730/新闻照片/CRH 2021 (2).jpg',
    'crh-2021-02.webp': '0730/新闻照片/CRH 2021.jpg',
    'evaporative-cooling-2020-01.webp': '0730/新闻照片/97b0d3f0c6bd279ccba0a2d2c066fd03.jpg',
    'evaporative-cooling-2020-02.webp': '0730/新闻照片/baf4be3e9ac8fc4e6186566f476eeee6.jpg',
    'evaporative-cooling-2020-03.webp': '0730/新闻照片/86c1c77c5defb27256fc594e8b0db02a.jpg',
    'evaporative-cooling-2020-04.webp': '0730/新闻照片/467cb4f1f0d775d7f56d79f016a0612b.jpg',
    'evaporative-cooling-2020-05.webp': '0730/新闻照片/b0a32e464882237361593bdf859751f1.jpg',
    'health-check-2021-01.webp': '0730/新闻照片/合照2.jpg',
    'health-check-2021-02.webp': '0730/新闻照片/合照1.jpg',
    'health-check-2021-03.webp': '0730/新闻照片/合照4.jpg',
    'health-check-2021-04.webp': '0730/新闻照片/合照5.jpg',
    'shanghai-expo-2019-01.webp': '0730/新闻照片/1245f69e9d51d82bd56e6ebcec43ac00.jpg',
    'shanghai-expo-2019-02.webp': '0730/新闻照片/5f5e44fa878f398e43d04ef95fd2b0a9.jpg',
    'shanghai-expo-2019-03.webp': '0730/新闻照片/8a37f7ad6cbc0a4ada02d9074e7ee49f.jpg',
    'shanghai-expo-2019-04.webp': '0730/新闻照片/f0c1fd863ff02bf853ce76764395a58e.jpg',
    'shanghai-expo-2019-05.webp': '0730/新闻照片/ba1a2c646fd41173acedf86a36cbcb14.jpg',
    'team-building-2025-01.webp': '0730/新闻照片/222.png',
    'team-building-2025-02.webp': '0730/新闻照片/f1f4e6822eef4b279fec6ef11ede658b.jpg',
    'team-building-2025-03.webp': '0730/新闻照片/2019052318_fb97852c9f15616f71f5ltgpwBaQAVbI.png',
  };
  for (const [filename, originalPath] of Object.entries(expectedOriginalPaths)) {
    const url = `${CDN_BASE_URL}/news-0730/${filename}`;
    assert.equal(imageResources[url]?.originalPath, originalPath, `${filename}: original path`);
  }
});

test('news list and generic detail expose required behavior', async () => {
  const [listPage, detailPage, styles] = await Promise.all([
    readTextFile('src/pages/news/index.ts'),
    readTextFile('src/pages/news/detail/index.ts'),
    readTextFile('src/styles/components/_news-page.scss'),
  ]);

  for (const field of ['date', 'category']) {
    assert.match(listPage, new RegExp(`item\\.${field}`));
  }
  assert.match(listPage, /td\(item, 'title'\)/);
  assert.match(listPage, /td\(item, 'excerpt'\)/);
  assert.match(listPage, /item\.featuredImage \?\? item\.images\[0\]/);
  assert.match(listPage, /basePath\('\/news\/detail\/'\)/);
  assert.match(listPage, /encodeURIComponent\(item\.id\)/);
  assert.match(listPage, /\['all', 'company', 'industry'\]/);

  assert.match(detailPage, /new URLSearchParams\(window\.location\.search\)\.get\('id'\)/);
  assert.match(detailPage, /article \? createArticle\(article\) : createNotFound\(\)/);
  assert.match(detailPage, /basePath\('\/news\/'\)/);
  assert.match(detailPage, /news\.notFound\.title/);
  assert.match(detailPage, /news\.notFound\.desc/);

  assert.match(listPage, /timeZone: 'UTC'/);
  assert.match(detailPage, /timeZone: 'UTC'/);
  assert.match(styles, /max-width: 44rem/);
  assert.match(styles, /height: auto/);
  assert.match(styles, /object-fit: contain/);
  assert.doesNotMatch(styles, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.doesNotMatch(styles, /&__link \{\s*display: block/);
});
