import '@/styles/main.scss';
import { createHeroCarousel } from '@/components/hero-carousel/HeroCarousel';
import type { HeroSlide } from '@/components/hero-carousel/HeroCarousel';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { t } from '@/i18n';
import { renderProjects } from '@/pages/projects/renderProjects';
import { renderProducts } from '@/pages/solutions/renderProducts';
import { renderStats } from '@/pages/contact/renderContact';
import { initPage } from '@/utils/mountLayout';

function renderHomePage(): void {
  const main = document.getElementById('page-content');

  if (!main) {
    return;
  }

  const heroSlides: readonly HeroSlide[] = [
    {
      headline: t('hero.carousel.0.headline'),
      subtitle: t('hero.carousel.0.subtitle'),
      ctaLabel: t('hero.cta'),
      ctaHref: '/contact/',
      imageSrc: '/images/placeholder.svg',
      imageAlt: t('hero.carousel.0.alt'),
      contentAlign: 'left',
      overlayStyle: 'left-heavy',
    },
    {
      headline: t('hero.carousel.1.headline'),
      subtitle: t('hero.carousel.1.subtitle'),
      ctaLabel: t('hero.cta'),
      ctaHref: '/contact/',
      imageSrc: '/images/placeholder.svg',
      imageAlt: t('hero.carousel.1.alt'),
      contentAlign: 'center',
      overlayStyle: 'minimal',
    },
    {
      headline: t('hero.carousel.2.headline'),
      subtitle: t('hero.carousel.2.subtitle'),
      ctaLabel: t('hero.cta'),
      ctaHref: '/contact/',
      imageSrc: '/images/placeholder.svg',
      imageAlt: t('hero.carousel.2.alt'),
      contentAlign: 'right',
      overlayStyle: 'right-heavy',
    },
    {
      headline: t('hero.carousel.3.headline'),
      subtitle: t('hero.carousel.3.subtitle'),
      ctaLabel: t('hero.cta'),
      ctaHref: '/contact/',
      imageSrc: '/images/placeholder.svg',
      imageAlt: t('hero.carousel.3.alt'),
      contentAlign: 'left',
      overlayStyle: 'minimal',
    },
  ];

  const hero = createHeroCarousel(heroSlides);

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
  section.className = 'section section--compact';

  const container = document.createElement('div');
  container.className = 'container';

  const content = document.createElement('div');
  content.id = contentId;

  container.append(title, content);
  section.appendChild(container);

  return section;
}

initPage('home', renderHomePage);
