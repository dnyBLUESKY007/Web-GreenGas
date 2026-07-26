import '@/styles/main.scss';
import { createAboutSummary } from '@/components/about-summary/AboutSummary';
import { createCaseCarousel } from '@/components/case-carousel/CaseCarousel';
import { createClientLogos } from '@/components/client-logos/ClientLogos';
import { createHeroCarousel } from '@/components/hero-carousel/HeroCarousel';
import type { HeroSlide } from '@/components/hero-carousel/HeroCarousel';
import { createHeroIntro } from '@/components/hero-intro/HeroIntro';
import { createIndustryPreview } from '@/components/industry-preview/IndustryPreview';
import { createNewsPreview } from '@/components/news-preview/NewsPreview';
import { createProductGrid } from '@/components/product-grid/ProductGrid';
import { createServiceStrip } from '@/components/service-strip/ServiceStrip';
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
      imageSrc: cdnUrl('web', 'homepage-hero-steel-mill.webp'),
      imageAlt: t('hero.carousel.0.alt'),
      contentAlign: 'left',
      overlayStyle: 'left-heavy',
    },
    {
      headline: t('hero.carousel.1.headline'),
      subtitle: t('hero.carousel.1.subtitle'),
      ctaLabel: t('hero.cta'),
      ctaHref: basePath('/contact/'),
      imageSrc: cdnUrl('web', 'homepage-hero-rolling-mill.webp'),
      imageAlt: t('hero.carousel.1.alt'),
      contentAlign: 'center',
      overlayStyle: 'minimal',
    },
    {
      headline: t('hero.carousel.2.headline'),
      subtitle: t('hero.carousel.2.subtitle'),
      ctaLabel: t('hero.cta'),
      ctaHref: basePath('/contact/'),
      imageSrc: cdnUrl('web', 'homepage-hero-coal-transport.webp'),
      imageAlt: t('hero.carousel.2.alt'),
      contentAlign: 'right',
      overlayStyle: 'right-heavy',
    },
    {
      headline: t('hero.carousel.3.headline'),
      subtitle: t('hero.carousel.3.subtitle'),
      ctaLabel: t('hero.cta'),
      ctaHref: basePath('/contact/'),
      imageSrc: cdnUrl('web', 'homepage-hero-industrial-ac-design.webp'),
      imageAlt: t('hero.carousel.3.alt'),
      contentAlign: 'left',
      overlayStyle: 'minimal',
    },
  ];

  const hero = createHeroCarousel(heroSlides);
  const heroIntro = createHeroIntro();

  const productGrid = createProductGrid();
  const industryPreview = createIndustryPreview();
  const caseCarousel = createCaseCarousel();
  const clientLogos = createClientLogos({ showDestinationLink: true });
  const newsPreview = createNewsPreview();
  const serviceStrip = createServiceStrip();
  const aboutSummary = createAboutSummary();

  main.replaceChildren(
    hero,
    heroIntro,
    productGrid,
    industryPreview,
    caseCarousel,
    clientLogos,
    newsPreview,
    serviceStrip,
    aboutSummary,
  );
}

initPage('home', renderHomePage);
