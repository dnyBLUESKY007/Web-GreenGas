import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

test('About page preserves formal company content and evidence boundaries', async () => {
  const company = JSON.parse(await read('src/data/company.json'));
  const source = await read('../templates/previous/company/发展历程.md');
  const sourceParagraphs = source
    .split('\n')
    .filter((line) => line.startsWith('宁波格灵'));
  const approvedSourceParagraphs = sourceParagraphs.map((paragraph) =>
    paragraph.replace('ISO140001', 'ISO14001'),
  );

  assert.equal(sourceParagraphs.length, 4);
  assert.deepEqual(company.profile.paragraphs_zh, approvedSourceParagraphs);
  assert.equal(company.profile.paragraphs.length, 4);
  assert.equal(company.profile.paragraphs_ru.length, 4);
  assert.ok(company.profile.paragraphs.every(Boolean));
  assert.ok(company.profile.paragraphs_ru.every(Boolean));
  for (const paragraphs of [
    company.profile.paragraphs,
    company.profile.paragraphs_zh,
    company.profile.paragraphs_ru,
  ]) {
    assert.match(paragraphs[2], /ISO14001(?!1)/);
    assert.doesNotMatch(paragraphs[2], /ISO140001/);
  }

  assert.deepEqual(
    company.managementPrinciples.map((principle) => principle.title_zh),
    ['技术', '节能', '质量', '服务'],
  );
  assert.deepEqual(company.industries_zh, ['钢铁', '化工', '电力', '制药', '军工']);
  assert.deepEqual(company.marketExperience.international_zh, ['南非', '澳洲', '韩国', '俄罗斯']);
  assert.deepEqual(
    company.marketExperience.domestic_zh,
    ['中冶京诚', '中冶北方', '河钢', '济钢', '鞍钢', '包钢'],
  );
  for (const principle of company.managementPrinciples) {
    assert.ok(principle.title && principle.title_ru);
    assert.ok(principle.description && principle.description_zh && principle.description_ru);
  }

  const certifications = JSON.parse(await read('src/data/certifications.json'));
  const imageResources = JSON.parse(await read('src/data/image-resources.json'));
  assert.deepEqual(
    certifications.map(({ id, publicationStatus, validityStatus, validUntil }) => ({
      id,
      publicationStatus,
      validityStatus,
      validUntil,
    })),
    [
      { id: 'iso9001', publicationStatus: 'approved', validityStatus: 'historical', validUntil: '2023-12-15' },
      { id: 'ce', publicationStatus: 'approved', validityStatus: 'historical', validUntil: '2025-11-08' },
    ],
  );
  for (const certification of certifications) {
    const imageUrl = `https://web-greengas.oss-cn-qingdao.aliyuncs.com/resources/${certification.imageCategory}/${certification.image}`;
    assert.ok(imageResources[imageUrl], `registered certificate image ${imageUrl}`);
  }
  const certificationComponent = await read('src/components/certifications/Certifications.ts');
  assert.match(certificationComponent, /publicationStatus === 'approved'/);
  assert.match(certificationComponent, /cdnUrl\(cert\.imageCategory, cert\.image\)/);
  assert.match(certificationComponent, /home\.certifications\.historical/);
  assert.match(certificationComponent, /about\.media\.pending/);

  const page = await read('src/pages/about/index.ts');
  assert.match(page, /about\.media\.pending/);
  assert.doesNotMatch(page, /cdnUrl\(/);
  assert.match(page, /basePath\('\/about\/certifications\/'\)/);
  assert.match(page, /basePath\('\/about\/clients\/'\)/);

  for (const locale of ['en', 'zh', 'ru']) {
    const messages = JSON.parse(await read(`src/i18n/locales/${locale}.json`));
    assert.doesNotMatch(messages['meta.about.ogDescription'], /15\+|15 年|15-лет/);
    assert.doesNotMatch(messages['about.certifications.desc'], /pending|待替换|ожидают замены/i);
  }
});
