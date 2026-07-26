import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

test('contact page exposes the approved FAQ and honest pre-EmailJS state', async () => {
  const company = JSON.parse(await read('src/data/company.json'));
  assert.equal(company.faq.length, 6);

  for (const item of company.faq) {
    for (const field of ['question', 'question_zh', 'question_ru', 'answer', 'answer_zh', 'answer_ru']) {
      assert.equal(typeof item[field], 'string', `${field} must be present`);
      assert.notEqual(item[field].trim(), '', `${field} must not be empty`);
    }

    if ('answerItems' in item) {
      assert.ok(item.answerItems.length > 1);
      assert.equal(item.answerItems_zh.length, item.answerItems.length);
      assert.equal(item.answerItems_ru.length, item.answerItems.length);
    }
  }
  assert.ok(company.faq.some((item) => item.answerItems));

  assert.ok(company.contact.length > 0);
  assert.ok(company.contact.every((channel) => channel.status === 'approved'));

  const contactConfig = await read('src/config/contact.ts');
  assert.match(contactConfig, /channel\.status === 'approved'/);

  const contactPage = await read('src/pages/contact/index.ts');
  assert.match(contactPage, /main\.replaceChildren\(header, faqSection, contactSection\)/);

  const renderer = await read('src/pages/contact/renderContact.ts');
  assert.match(renderer, /document\.createElement\('details'\)/);
  assert.match(renderer, /document\.createElement\('summary'\)/);
  assert.match(renderer, /document\.createElement\('ol'\)/);

  const form = await read('src/components/contact-form/ContactForm.ts');
  assert.match(form, /disabled aria-disabled="true"/);
  assert.doesNotMatch(form, /addEventListener\('submit'|alert\(/);

  for (const locale of ['en', 'zh', 'ru']) {
    const messages = JSON.parse(await read(`src/i18n/locales/${locale}.json`));
    assert.match(messages['form.note'], /EmailJS/i);
    assert.ok(messages['form.unavailable']);
  }
});
