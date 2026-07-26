import '@/styles/main.scss';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import companyData from '@/data/company.json';
import { getLocale, t, td } from '@/i18n';
import { initPage } from '@/utils/mountLayout';
import { basePath } from '@/utils/path';
import type { CompanyData, CompanyValue } from '@/types';

const company = companyData as CompanyData;

function getLocalizedList(
  items: readonly string[],
  itemsZh?: readonly string[],
  itemsRu?: readonly string[],
): readonly string[] {
  switch (getLocale()) {
    case 'zh':
      return itemsZh ?? items;
    case 'ru':
      return itemsRu ?? items;
    default:
      return items;
  }
}

function renderAboutPage(): void {
  const main = document.getElementById('page-content');

  if (!main) {
    return;
  }

  const header = document.createElement('section');
  header.className = 'page-header';
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
    createPrinciplesSection(),
    createScopeSection(),
    createExperienceSection(),
    createTeamSection(),
    createHistorySection(),
    createTrustLinksSection(),
  );
}

function createProfileSection(): HTMLElement {
  const profile = company.profile;
  const section = document.createElement('section');
  section.className = 'section about-page__profile';
  const paragraphs = getLocalizedList(profile.paragraphs, profile.paragraphs_zh, profile.paragraphs_ru)
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join('');

  section.innerHTML = `
    <div class="container about-page__profile-grid">
      <div class="about-page__content">
        <p class="section-eyebrow">${t('about.profile.eyebrow')}</p>
        <h2>${td(profile, 'title')}</h2>
        ${paragraphs}
      </div>
      ${createMediaPlaceholder(t('about.media.factory'))}
    </div>
  `;

  return section;
}

function createPrinciplesSection(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section about-page__principles';
  const principles = company.managementPrinciples
    .map((principle: CompanyValue, index) => `
      <article class="about-page__principle">
        <span>0${index + 1}</span>
        <h3>${td(principle, 'title')}</h3>
        <p>${td(principle, 'description')}</p>
      </article>
    `)
    .join('');

  section.innerHTML = `
    <div class="container">
      <div class="about-page__section-heading">
        <p class="section-eyebrow">${t('about.principles.eyebrow')}</p>
        <h2>${t('about.principles.title')}</h2>
      </div>
      <div class="about-page__principles-grid">${principles}</div>
    </div>
  `;

  return section;
}

function createScopeSection(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section about-page__scope';
  const products = createTagList(
    getLocalizedList(company.productRange, company.productRange_zh, company.productRange_ru),
  );
  const industries = createTagList(
    getLocalizedList(company.industries, company.industries_zh, company.industries_ru),
  );

  section.innerHTML = `
    <div class="container">
      <div class="about-page__section-heading">
        <p class="section-eyebrow">${t('about.scope.eyebrow')}</p>
        <h2>${t('about.scope.title')}</h2>
        <p>${t('about.scope.desc')}</p>
      </div>
      <div class="about-page__scope-grid">
        <article>
          <h3>${t('about.products.label')}</h3>
          <ul class="about-page__tag-list">${products}</ul>
        </article>
        <article>
          <h3>${t('about.industries.label')}</h3>
          <ul class="about-page__tag-list">${industries}</ul>
        </article>
      </div>
    </div>
  `;

  return section;
}

function createExperienceSection(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section about-page__experience';
  const experience = company.marketExperience;
  const internationalMarkets = createTagList(
    getLocalizedList(
      experience.international,
      experience.international_zh,
      experience.international_ru,
    ),
  );
  const domesticOrganizations = createTagList(
    getLocalizedList(experience.domestic, experience.domestic_zh, experience.domestic_ru),
  );

  section.innerHTML = `
    <div class="container about-page__experience-grid">
      <div class="about-page__section-heading">
        <p class="section-eyebrow">${t('about.experience.eyebrow')}</p>
        <h2>${t('about.experience.title')}</h2>
        <p>${t('about.experience.desc')}</p>
        <p class="about-page__evidence-note">${t('about.experience.note')}</p>
      </div>
      <div class="about-page__coverage">
        <div>
          <h3>${t('about.experience.international')}</h3>
          <ul class="about-page__tag-list">${internationalMarkets}</ul>
        </div>
        <div>
          <h3>${t('about.experience.domestic')}</h3>
          <ul class="about-page__tag-list">${domesticOrganizations}</ul>
        </div>
      </div>
    </div>
  `;

  return section;
}

function createTeamSection(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section about-page__team';
  section.id = 'team';
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
        ${createMediaPlaceholder(t('about.media.team'))}
        <div class="about-page__values">${teamValues}</div>
      </div>
    </div>
  `;

  return section;
}

function createHistorySection(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section about-page__history';
  section.id = 'history';

  section.innerHTML = `
    <div class="container">
      <div class="about-page__section-heading">
        <p class="section-eyebrow">${t('about.history.eyebrow')}</p>
        <h2>${t('about.history.title')}</h2>
        <p>${t('about.history.desc')}</p>
      </div>
      <div class="about-page__history-grid">
        ${createMediaPlaceholder(t('about.media.history'))}
        ${createMediaPlaceholder(t('about.media.production'))}
      </div>
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
      <a href="#team">
        <span>${t('about.trust.team.eyebrow')}</span>
        <strong>${t('about.trust.team.title')}</strong>
      </a>
      <a href="#history">
        <span>${t('about.trust.history.eyebrow')}</span>
        <strong>${t('about.trust.history.title')}</strong>
      </a>
    </div>
  `;

  return section;
}

function createTagList(items: readonly string[]): string {
  return items.map((item) => `<li>${item}</li>`).join('');
}

function createMediaPlaceholder(subject: string): string {
  return `
    <div class="about-page__media-placeholder" role="img" aria-label="${subject} — ${t('about.media.pending')}">
      <span>${t('about.media.pending')}</span>
      <strong>${subject}</strong>
    </div>
  `;
}

initPage('about', renderAboutPage);
