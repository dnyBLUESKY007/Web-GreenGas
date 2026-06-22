import '@/styles/main.scss';
import { createHero } from '@/components/hero/Hero';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import companyData from '@/data/company.json';
import { t, td } from '@/i18n';
import { renderProjects } from '@/pages/projects/renderProjects';
import { renderProducts } from '@/pages/solutions/renderProducts';
import { renderStats } from '@/pages/contact/renderContact';
import { initPage } from '@/utils/mountLayout';
import type { CompanyData } from '@/types';

const company = companyData as CompanyData;

function renderHomePage(): void {
  const main = document.getElementById('page-content');

  if (!main) {
    return;
  }

  const hero = createHero({
    title: td(company, 'tagline'),
    subtitle: td(company, 'description'),
    ctaLabel: t('hero.cta'),
    ctaHref: '/contact/',
    imageSrc: '/images/placeholder.svg',
    imageAlt: t('hero.imageAlt'),
  });

  const solutionsSection = createSectionBlock(
    createSectionTitle({
      eyebrow: t('home.solutions.eyebrow'),
      title: t('home.solutions.title'),
      description: t('home.solutions.desc'),
    }),
    'home-solutions',
  );

  const projectsSection = createSectionBlock(
    createSectionTitle({
      eyebrow: t('home.projects.eyebrow'),
      title: t('home.projects.title'),
      description: t('home.projects.desc'),
    }),
    'home-projects',
  );

  const statsSection = createSectionBlock(
    createSectionTitle({
      eyebrow: t('home.capabilities.eyebrow'),
      title: t('home.capabilities.title'),
    }),
    'home-stats',
  );

  const contactSection = document.createElement('section');
  contactSection.className = 'section section--cta';
  contactSection.innerHTML = `
    <div class="container section--cta__inner">
      <h2 class="section--cta__title">${t('home.cta.title')}</h2>
      <a class="btn btn--primary" href="/contact/">${t('nav.cta')}</a>
    </div>
  `;

  main.replaceChildren(hero, solutionsSection, projectsSection, statsSection, contactSection);

  renderProducts(document.getElementById('home-solutions')!);
  renderProjects(document.getElementById('home-projects')!);
  renderStats(document.getElementById('home-stats')!);
}

function createSectionBlock(title: HTMLElement, contentId: string): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section';

  const container = document.createElement('div');
  container.className = 'container';

  const content = document.createElement('div');
  content.id = contentId;

  container.append(title, content);
  section.appendChild(container);

  return section;
}

initPage('home', renderHomePage);
