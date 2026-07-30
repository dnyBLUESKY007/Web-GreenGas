import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readFrontendFile(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

test('partner showcase uses supplied logos through the project CDN and links official sites', async () => {
  const groups = JSON.parse(await readFrontendFile('src/data/clients.json'));
  const imageResources = JSON.parse(await readFrontendFile('src/data/image-resources.json'));
  assert.ok(groups.length > 0);

  for (const group of groups) {
    assert.equal(group.status, 'verified-content');
    assert.ok(group.name && group.name_zh && group.name_ru);
    assert.ok(group.partners.length > 0);

    for (const partner of group.partners) {
      assert.equal(partner.status, 'verified-content');
      assert.ok(partner.name && partner.name_zh && partner.name_ru);
      assert.ok(partner.logo?.category && partner.logo?.filename);
      assert.ok(partner.logo.alt && partner.logo.alt_zh && partner.logo.alt_ru);
      assert.match(partner.website, /^https:\/\/www\./);
      const logoUrl = `https://web-greengas.oss-cn-qingdao.aliyuncs.com/resources/${partner.logo.category}/${partner.logo.filename}`;
      assert.ok(imageResources[logoUrl], `registered partner logo ${logoUrl}`);
    }
  }

  const component = await readFrontendFile('src/components/client-logos/ClientLogos.ts');
  assert.match(component, /client-logos__group/);
  assert.match(component, /client-logos__status/);
  assert.match(component, /logoImage\.alt = td\(logo, 'alt'\)/);
  assert.match(component, /cdnUrl\(logo\.category, logo\.filename\)/);
  assert.match(component, /link\.href = partner\.website/);
  assert.match(component, /noopener noreferrer/);

  const expectedStatus = {
    en: 'Partner materials pending',
    zh: '合作资料待补充',
    ru: 'Материалы партнёров ожидаются',
  };
  for (const [locale, label] of Object.entries(expectedStatus)) {
    const messages = JSON.parse(
      await readFrontendFile(`src/i18n/locales/${locale}.json`),
    );
    assert.equal(messages['home.clients.status.pending-replacement'], label);
    assert.doesNotMatch(messages['home.clients.desc'], /will appear|确认后|появятся/i);
    assert.doesNotMatch(messages['about.clients.desc'], /will appear|确认后|появятся/i);
  }

  const styles = await readFrontendFile('src/styles/components/_client-logos.scss');
  assert.match(styles, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media \(width < \$breakpoint-md\)/);
  assert.match(styles, /@media \(width < \$breakpoint-sm\)/);
});
