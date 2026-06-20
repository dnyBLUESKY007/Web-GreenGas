import '@/styles/main.scss';
import { createHero } from '@/components/hero/Hero';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import companyData from '@/data/company.json';
import { renderProjects } from '@/pages/projects/renderProjects';
import { renderProducts } from '@/pages/solutions/renderProducts';
import { renderStats } from '@/pages/contact/renderContact';
import { mountLayout } from '@/utils/mountLayout';
import type { CompanyData } from '@/types';

const company = companyData as CompanyData;

function renderHomePage(): void {
  const main = document.getElementById('page-content');

  if (!main) {
    return;
  }

  const hero = createHero({
    title: company.tagline,
    subtitle: company.description,
    ctaLabel: 'Request a Consultation',
    ctaHref: '/contact/',
    imageSrc: '/images/placeholder.svg',
    imageAlt: 'GREENGAS industrial facility exterior',
  });

  const solutionsSection = createSectionBlock(
    createSectionTitle({
      eyebrow: 'Solutions',
      title: 'Cooling Systems by Application',
      description: 'Engineered for marine, manufacturing, high-temperature, and hazardous environments.',
    }),
    'home-solutions',
  );

  const projectsSection = createSectionBlock(
    createSectionTitle({
      eyebrow: 'Projects',
      title: 'Recent Installations',
      description: 'Selected projects showing design, delivery, and operational results.',
    }),
    'home-projects',
  );

  const statsSection = createSectionBlock(
    createSectionTitle({
      eyebrow: 'Capabilities',
      title: 'Engineering You Can Measure',
    }),
    'home-stats',
  );

  const contactSection = document.createElement('section');
  contactSection.className = 'section section--cta';
  contactSection.innerHTML = `
    <div class="container section--cta__inner">
      <h2 class="section--cta__title">Ready to discuss your cooling requirements?</h2>
      <a class="btn btn--primary" href="/contact/">Contact Us</a>
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

mountLayout('home');
renderHomePage();
