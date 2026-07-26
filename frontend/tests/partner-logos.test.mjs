import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readFrontendFile(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

test('partner showcase keeps unapproved logos explicit, local, and accessible', async () => {
  const groups = JSON.parse(await readFrontendFile('src/data/clients.json'));
  assert.ok(groups.length > 0);

  for (const group of groups) {
    assert.equal(group.status, 'pending-replacement');
    assert.ok(group.name && group.name_zh && group.name_ru);
    assert.ok(group.partners.length > 0);

    for (const partner of group.partners) {
      assert.equal(partner.status, 'pending-replacement');
      assert.ok(partner.name && partner.name_zh && partner.name_ru);
      assert.equal(partner.logo, null);
      assert.doesNotMatch(JSON.stringify(partner), /https?:\/\//);
    }
  }

  const component = await readFrontendFile('src/components/client-logos/ClientLogos.ts');
  assert.match(component, /client-logos__group/);
  assert.match(component, /client-logos__status/);
  assert.match(component, /logoImage\.alt = td\(logo, 'alt'\)/);
  assert.match(component, /cdnUrl\(logo\.category, logo\.filename\)/);

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
  }

  const styles = await readFrontendFile('src/styles/components/_client-logos.scss');
  assert.match(styles, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media \(width < \$breakpoint-md\)/);
  assert.match(styles, /@media \(width < \$breakpoint-sm\)/);
});
