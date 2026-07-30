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
      ctaLabel: t('home.products.more'),
      ctaHref: basePath('/products/'),
      imageSrc: cdnUrl('web', 'homepage-hero-steel-mill.webp'),
      imageAlt: t('hero.carousel.0.alt'),
      productImageSrc: cdnUrl('products_v2', 'industrial_air-cooled-temp-humidity_retouched_1.webp'),
      productImageAlt: t('hero.carousel.0.productAlt'),
      contentAlign: 'left',
      overlayStyle: 'left-heavy',
    },
    {
      headline: t('hero.carousel.1.headline'),
      subtitle: t('hero.carousel.1.subtitle'),
      ctaLabel: t('home.products.more'),
      ctaHref: basePath('/products/'),
      imageSrc: cdnUrl('web', 'homepage-hero-rolling-mill.webp'),
      imageAlt: t('hero.carousel.1.alt'),
      productImageSrc: cdnUrl('products_v2', 'central-host_air-cooled-screw-heat-pump_retouched_1.webp'),
      productImageAlt: t('hero.carousel.1.productAlt'),
      contentAlign: 'left',
      overlayStyle: 'left-heavy',
    },
    {
      headline: t('hero.carousel.2.headline'),
      subtitle: t('hero.carousel.2.subtitle'),
      ctaLabel: t('home.products.more'),
      ctaHref: basePath('/products/'),
      imageSrc: cdnUrl('web', 'homepage-hero-coal-transport.webp'),
      imageAlt: t('hero.carousel.2.alt'),
      productImageSrc: cdnUrl('products_v2', 'commercial-terminal_air-handling-unit_retouched_1.webp'),
      productImageAlt: t('hero.carousel.2.productAlt'),
      contentAlign: 'left',
      overlayStyle: 'left-heavy',
    },
    {
      headline: t('hero.carousel.3.headline'),
      subtitle: t('hero.carousel.3.subtitle'),
      ctaLabel: t('home.products.more'),
      ctaHref: basePath('/products/'),
      imageSrc: cdnUrl('web', 'homepage-hero-industrial-ac-design.webp'),
      imageAlt: t('hero.carousel.3.alt'),
      productImageSrc: cdnUrl('products_v2', 'custom_packaged-dx-evap-cond_retouched_1.webp'),
      productImageAlt: t('hero.carousel.3.productAlt'),
      contentAlign: 'left',
      overlayStyle: 'left-heavy',
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
