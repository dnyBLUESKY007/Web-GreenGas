import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

const faqTextFields = [
  'question',
  'question_zh',
  'question_ru',
  'answer',
  'answer_zh',
  'answer_ru',
];
const answerItemFields = ['answerItems', 'answerItems_zh', 'answerItems_ru'];

test('contact data provides six complete multilingual FAQs', async () => {
  const company = JSON.parse(await read('src/data/company.json'));
  assert.equal(company.faq.length, 6);

  for (const item of company.faq) {
    for (const field of faqTextFields) {
      assert.equal(typeof item[field], 'string', `${field} must be present`);
      assert.notEqual(item[field].trim(), '', `${field} must not be empty`);
    }

    if (answerItemFields.some((field) => field in item)) {
      for (const field of answerItemFields) {
        assert.ok(Array.isArray(item[field]), `${field} must be present`);
        assert.ok(item[field].length > 1, `${field} must contain multiple items`);
      }

      assert.equal(item.answerItems_zh.length, item.answerItems.length);
      assert.equal(item.answerItems_ru.length, item.answerItems.length);
    }
  }

  assert.ok(company.faq.some((item) => item.answerItems));

  const renderer = await read('src/pages/contact/renderContact.ts');
  assert.match(renderer, /document\.createElement\('details'\)/);
  assert.match(renderer, /document\.createElement\('summary'\)/);
  assert.match(renderer, /document\.createElement\('ol'\)/);
});

test('contact page only exposes approved channels', async () => {
  const company = JSON.parse(await read('src/data/company.json'));

  assert.ok(company.contact.length > 0);
  assert.ok(company.contact.every((channel) => channel.status === 'approved'));

  const contactConfig = await read('src/config/contact.ts');
  assert.match(contactConfig, /channel\.status === 'approved'/);
});

test('contact page exposes FAQ before an honestly disabled message form', async () => {
  const contactPage = await read('src/pages/contact/index.ts');
  assert.match(contactPage, /main\.replaceChildren\(header, faqSection, contactSection\)/);
  assert.match(contactPage, /location\.hash === '#faq'/);
  assert.match(contactPage, /faqSection\.scrollIntoView\(\)/);

  const form = await read('src/components/contact-form/ContactForm.ts');
  assert.match(form, /disabled aria-disabled="true"/);
  assert.doesNotMatch(form, /addEventListener\('submit'|alert\(/);

  for (const locale of ['en', 'zh', 'ru']) {
    const messages = JSON.parse(await read(`src/i18n/locales/${locale}.json`));
    assert.match(messages['form.note'], /EmailJS/i);
    assert.ok(messages['form.unavailable']);
  }
});
