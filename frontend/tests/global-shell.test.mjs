import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const BRAND_TITLE = 'GREENGAS 格灵空调';
const root = new URL('../', import.meta.url);
const htmlEntries = [
  'index.html',
  'about/index.html',
  'about/certifications/index.html',
  'about/clients/index.html',
  'products/index.html',
  'industries/index.html',
  'support/index.html',
  'cases/index.html',
  'solutions/index.html',
  'contact/index.html',
  'news/index.html',
  'news/detail/index.html',
  'faq/index.html',
];

async function read(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

test('global shell exposes the approved navigation, title, and legacy routes', async () => {
  const navigation = await read('src/config/navigation.ts');
  const expectedNavigation = [
    ['home', 'nav.home', '/'],
    ['about', 'nav.about', '/about/'],
    ['products', 'nav.products', '/products/'],
    ['industries', 'nav.industries', '/industries/'],
    ['support', 'nav.support', '/support/'],
    ['cases', 'nav.cases', '/cases/'],
    ['news', 'nav.news', '/news/'],
    ['contact', 'nav.contact', '/contact/'],
  ];

  let previousIndex = -1;
  for (const [id, labelKey, path] of expectedNavigation) {
    const item = `{ id: '${id}', labelKey: '${labelKey}', href: basePath('${path}') }`;
    const itemIndex = navigation.indexOf(item);
    assert.ok(itemIndex > previousIndex, `missing or misordered navigation item: ${item}`);
    previousIndex = itemIndex;
  }

  const expectedLabels = {
    en: ['Home', 'About Us', 'Product Navigation', 'Industry Applications', 'Technical Support', 'Case Center', 'News Center', 'Contact Us'],
    zh: ['首页', '关于我们', '产品导航', '行业应用', '技术支持', '案例中心', '新闻中心', '联系我们'],
    ru: ['Главная', 'О компании', 'Каталог продукции', 'Отраслевые решения', 'Техническая поддержка', 'Центр проектов', 'Центр новостей', 'Контакты'],
  };
  const labelKeys = expectedNavigation.map(([, labelKey]) => labelKey);
  for (const [locale, labels] of Object.entries(expectedLabels)) {
    const messages = JSON.parse(await read(`src/i18n/locales/${locale}.json`));
    assert.deepEqual(labelKeys.map((key) => messages[key]), labels);
  }

  const navbar = await read('src/components/navbar/Navbar.ts');
  assert.doesNotMatch(navbar, /navbar__cta|nav\.cta/);
  assert.match(navbar, /menu\.querySelector<HTMLAnchorElement>\('a'\)\?\.focus\(\)/);
  assert.match(navbar, /closePanel\(true\)/);

  const navbarStyles = await read('src/styles/components/_navbar.scss');
  assert.match(navbarStyles, /font-size: 1\.0625rem/);
  assert.match(navbarStyles, /width: calc\(100% - 2rem\)/);
  assert.match(navbarStyles, /@media \(width >= 84rem\)/);

  const pageMeta = await read('src/config/pageMeta.ts');
  assert.match(pageMeta, new RegExp(`const BRAND_TITLE = ['\"]${BRAND_TITLE}['\"]`));
  assert.match(pageMeta, /document\.title = BRAND_TITLE/);

  for (const htmlPath of htmlEntries) {
    const html = await read(htmlPath);
    assert.match(html, new RegExp(`<title>${BRAND_TITLE}</title>`), htmlPath);
  }

  const solutionsRedirect = await read('src/pages/legacy/solutions.ts');
  assert.match(solutionsRedirect, /location\.replace\(basePath\('\/products\/'\)\)/);

  const faqRedirect = await read('src/pages/legacy/faq.ts');
  assert.match(faqRedirect, /location\.replace\(basePath\('\/contact\/#faq'\)\)/);

  const viteConfig = await read('vite.config.ts');
  for (const route of ['products', 'industries', 'support', 'cases', 'solutions', 'faq']) {
    assert.match(viteConfig, new RegExp(`${route}: resolve\\(__dirname, '${route}\\/index\\.html'\\)`));
  }

  const contactPage = await read('src/pages/contact/index.ts');
  assert.match(contactPage, /faqSection\.id = 'faq'/);
  assert.match(contactPage, /renderFaq\(faqMount\)/);
});
