import '@/styles/main.scss';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import companyData from '@/data/company.json';
import { getLocale, t, td } from '@/i18n';
import { initPage } from '@/utils/mountLayout';
import { cdnUrl, setPageHeaderBackground } from '@/config/assets';
import { basePath } from '@/utils/path';
import type { CompanyData, CompanyImage, CompanyProfile, CompanyValue } from '@/types';

const company = companyData as CompanyData;

function getLocalizedList(
  item: CompanyProfile | CompanyData,
  field: 'paragraphs' | 'industries',
): readonly string[] {
  const locale = getLocale();
  const record = item as unknown as Readonly<Record<string, readonly string[] | undefined>>;
  const localized = locale === 'en' ? undefined : record[`${field}_${locale}`];

  return localized ?? record[field] ?? [];
}

function renderAboutPage(): void {
  const main = document.getElementById('page-content');

  if (!main) {
    return;
  }

  const header = document.createElement('section');
  header.className = 'page-header';
  setPageHeaderBackground(header, '02_about.webp');
  header.appendChild(
    createSectionTitle({
      eyebrow: t('about.eyebrow'),
      title: `${company.name} ${company.name_zh ?? ''}`.trim(),
      description: td(company, 'description'),
    }),
  );

  main.replaceChildren(
    header,
    createProfileSection(),
    createCapabilitySection(),
    createTeamSection(),
    createHistorySection(),
    createTrustLinksSection(),
  );
}

function createProfileSection(): HTMLElement {
  const profile = company.profile as CompanyProfile;
  const section = document.createElement('section');
  section.className = 'section about-page__profile';
  const paragraphs = getLocalizedList(profile, 'paragraphs')
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join('');

  section.innerHTML = `
    <div class="container about-page__split">
      <div class="about-page__content">
        <p class="section-eyebrow">${t('about.profile.eyebrow')}</p>
        <h2>${td(profile, 'title')}</h2>
        ${paragraphs}
      </div>
      <figure class="about-page__facility">
        <img src="${cdnUrl('company', 'facility-exterior.webp')}" alt="${t('about.factory.alt')}" width="1200" height="640" loading="lazy" />
      </figure>
    </div>
  `;

  return section;
}

function createCapabilitySection(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section about-page__capabilities';
  const industries = getLocalizedList(company, 'industries')
    .map((industry) => `<li>${industry}</li>`)
    .join('');

  section.innerHTML = `
    <div class="container about-page__split">
      <div class="about-page__content">
        <p class="section-eyebrow">${t('about.mission.eyebrow')}</p>
        <h2>${t('about.mission.title')}</h2>
        <p>${td(company, 'mission')}</p>
      </div>
      <div class="about-page__industries">
        <p class="about-page__label">${t('about.industries.label')}</p>
        <ul>${industries}</ul>
      </div>
    </div>
  `;

  return section;
}

function createTeamSection(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section about-page__team';
  const teamValues = (company.teamValues ?? [])
    .map((value: CompanyValue) => `
      <article class="about-page__value">
        <h3>${td(value, 'title')}</h3>
        <p>${td(value, 'description')}</p>
      </article>
    `)
    .join('');

  section.innerHTML = `
    <div class="container">
      <div class="about-page__section-heading">
        <p class="section-eyebrow">${t('about.team.eyebrow')}</p>
        <h2>${t('about.team.title')}</h2>
      </div>
      <div class="about-page__team-grid">
        <img src="${cdnUrl('company-info', 'team-photo.webp')}" alt="${t('about.team.alt')}" loading="lazy" />
        <div class="about-page__values">${teamValues}</div>
      </div>
    </div>
  `;

  return section;
}

function createHistorySection(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section about-page__history';
  const figures = (company.historyImages ?? [])
    .map((image: CompanyImage) => `
      <figure>
        <img src="${cdnUrl(image.category, image.filename)}" alt="${td(image, 'alt')}" loading="lazy" />
      </figure>
    `)
    .join('');

  section.innerHTML = `
    <div class="container">
      <div class="about-page__section-heading">
        <p class="section-eyebrow">${t('about.history.eyebrow')}</p>
        <h2>${t('about.history.title')}</h2>
        <p>${t('about.history.desc')}</p>
      </div>
      <div class="about-page__history-grid">${figures}</div>
    </div>
  `;

  return section;
}

function createTrustLinksSection(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section about-page__links';
  section.innerHTML = `
    <div class="container about-page__trust-links">
      <a href="${basePath('/about/certifications/')}">
        <span>${t('about.trust.cert.eyebrow')}</span>
        <strong>${t('about.trust.cert.title')}</strong>
      </a>
      <a href="${basePath('/about/clients/')}">
        <span>${t('about.trust.clients.eyebrow')}</span>
        <strong>${t('about.trust.clients.title')}</strong>
      </a>
    </div>
  `;

  return section;
}

initPage('about', renderAboutPage);
