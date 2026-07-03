import '@/styles/main.scss';
import { createAboutSummary } from '@/components/about-summary/AboutSummary';
import { createCapabilityBand } from '@/components/capability-band/CapabilityBand';
import { createCaseCarousel } from '@/components/case-carousel/CaseCarousel';
import { createCertifications } from '@/components/certifications/Certifications';
import { createClientLogos } from '@/components/client-logos/ClientLogos';
import { createHeroCarousel } from '@/components/hero-carousel/HeroCarousel';
import type { HeroSlide } from '@/components/hero-carousel/HeroCarousel';
import { createHeroIntro } from '@/components/hero-intro/HeroIntro';
import { createProductMarquee } from '@/components/product-marquee/ProductMarquee';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { createServiceStrip } from '@/components/service-strip/ServiceStrip';
import { createStatsBand } from '@/components/stats-band/StatsBand';
import { renderSolutions } from '@/pages/home/renderSolutions';
import { renderContactChannels } from '@/pages/contact/renderContact';
import { t } from '@/i18n';
import { initPage } from '@/utils/mountLayout';
import { basePath } from '@/utils/path';
import { cdnUrl } from '@/config/assets';

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
      ctaHref: basePath('/contact/'),
      imageSrc: cdnUrl('hero', 'hero-steel-mill.webp'),
      imageAlt: t('hero.carousel.0.alt'),
      contentAlign: 'left',
      overlayStyle: 'left-heavy',
    },
    {
      headline: t('hero.carousel.1.headline'),
      subtitle: t('hero.carousel.1.subtitle'),
      ctaLabel: t('hero.cta'),
      ctaHref: basePath('/contact/'),
      imageSrc: cdnUrl('hero', 'hero-rolling-mill.webp'),
      imageAlt: t('hero.carousel.1.alt'),
      contentAlign: 'center',
      overlayStyle: 'minimal',
    },
    {
      headline: t('hero.carousel.2.headline'),
      subtitle: t('hero.carousel.2.subtitle'),
      ctaLabel: t('hero.cta'),
      ctaHref: basePath('/contact/'),
      imageSrc: cdnUrl('hero', 'hero-coal-transport.webp'),
      imageAlt: t('hero.carousel.2.alt'),
      contentAlign: 'right',
      overlayStyle: 'right-heavy',
    },
    {
      headline: t('hero.carousel.3.headline'),
      subtitle: t('hero.carousel.3.subtitle'),
      ctaLabel: t('hero.cta'),
      ctaHref: basePath('/contact/'),
      imageSrc: cdnUrl('hero', 'hero-industrial-ac-design.webp'),
      imageAlt: t('hero.carousel.3.alt'),
      contentAlign: 'left',
      overlayStyle: 'minimal',
    },
  ];

  const hero = createHeroCarousel(heroSlides);
  const heroIntro = createHeroIntro();

  const statsBand = createStatsBand();

  const solutionsSection = createSectionBlock(
    createSectionTitle({
      eyebrow: t('home.solutions.eyebrow'),
      title: t('home.solutions.title'),
      description: t('home.solutions.desc'),
    }),
    'home-solutions',
  );

  const capabilityBand = createCapabilityBand();
  const caseCarousel = createCaseCarousel();
  const productMarquee = createProductMarquee();
  const serviceStrip = createServiceStrip();
  const aboutSummary = createAboutSummary();
  const contactSection = createContactSection();
  const certifications = createCertifications();
  const clientLogos = createClientLogos();

  main.replaceChildren(
    hero,
    heroIntro,
    statsBand,
    solutionsSection,
    capabilityBand,
    caseCarousel,
    certifications,
    clientLogos,
    productMarquee,
    serviceStrip,
    aboutSummary,
    contactSection,
  );

  renderSolutions(document.getElementById('home-solutions')!);
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

function createContactSection(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section section--dark home-contact';

  const container = document.createElement('div');
  container.className = 'container home-contact__inner';

  const ctaBlock = document.createElement('div');
  ctaBlock.className = 'home-contact__cta';
  ctaBlock.innerHTML = `
    <h2 class="home-contact__title">${t('home.cta.title')}</h2>
    <a class="btn btn--primary" href="${basePath('/contact/')}">${t('nav.cta')}</a>
  `;

  const channelsMount = document.createElement('div');
  channelsMount.id = 'home-contact-channels';

  container.append(ctaBlock, channelsMount);
  section.appendChild(container);

  renderContactChannels(channelsMount);

  return section;
}

initPage('home', renderHomePage);
