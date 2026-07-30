import { t } from '@/i18n';

export type HeroContentAlign = 'left' | 'center' | 'right';
export type HeroOverlayStyle = 'left-heavy' | 'right-heavy' | 'minimal';

export interface HeroSlide {
  readonly headline: string;
  readonly subtitle: string;
  readonly ctaLabel: string;
  readonly ctaHref: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly productImageSrc?: string;
  readonly productImageAlt?: string;
  readonly contentAlign?: HeroContentAlign;
  readonly overlayStyle?: HeroOverlayStyle;
}

export const AUTO_ROTATE_INTERVAL = 6000;

const SWIPE_THRESHOLD = 50;

const SWIPE_HINT_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="16" viewBox="0 0 28 16" fill="none" aria-hidden="true">
  <path d="M2 8h20M2 8l4-4M2 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M26 8H6M26 8l-4-4M26 8l-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export function createHeroCarousel(slides: readonly HeroSlide[]): HTMLElement {
  const container = document.createElement('section');
  container.className = 'hero-carousel';
  container.setAttribute('aria-label', t('hero.carousel.label'));
  container.setAttribute('aria-roledescription', t('hero.carousel.role'));

  const slidesWrapper = document.createElement('div');
  slidesWrapper.className = 'hero-carousel__slides';

  for (let i = 0; i < slides.length; i++) {
    const slide = createSlideElement(slides[i], i === 0);
    slidesWrapper.appendChild(slide);
  }

  const prevBtn = document.createElement('button');
  prevBtn.className = 'hero-carousel__nav-btn hero-carousel__nav-btn--prev';
  prevBtn.setAttribute('aria-label', t('hero.carousel.prev'));
  prevBtn.type = 'button';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'hero-carousel__nav-btn hero-carousel__nav-btn--next';
  nextBtn.setAttribute('aria-label', t('hero.carousel.next'));
  nextBtn.type = 'button';

  const controls = document.createElement('div');
  controls.className = 'hero-carousel__controls';

  const swipeHint = document.createElement('div');
  swipeHint.className = 'hero-carousel__swipe-hint';
  swipeHint.setAttribute('aria-hidden', 'true');
  swipeHint.innerHTML = SWIPE_HINT_SVG;

  const tabRow = document.createElement('div');
  tabRow.className = 'hero-carousel__tab-row';

  const tabs = document.createElement('div');
  tabs.className = 'hero-carousel__tabs';

  for (let i = 0; i < slides.length; i++) {
    const tab = document.createElement('button');
    tab.className = 'hero-carousel__tab';
    tab.setAttribute('aria-label', `${t('hero.carousel.slide')} ${i + 1}`);
    tab.setAttribute('aria-current', String(i === 0));
    tab.dataset.index = String(i);

    const progress = document.createElement('span');
    progress.className = 'hero-carousel__tab-progress';
    tab.appendChild(progress);

    tabs.appendChild(tab);
  }

  tabRow.appendChild(tabs);
  controls.append(swipeHint, tabRow);
  container.append(slidesWrapper, prevBtn, nextBtn, controls);

  initializeCarousel(container, slides.length);

  return container;
}

function createSlideElement(slide: HeroSlide, isActive: boolean): HTMLElement {
  const el = document.createElement('div');
  el.className = 'hero-carousel__slide';

  if (isActive) {
    el.classList.add('hero-carousel__slide--active');
  }

  const media = document.createElement('div');
  media.className = 'hero-carousel__media';

  const imgBg = document.createElement('img');
  imgBg.className = 'hero-carousel__image hero-carousel__image--bg';
  imgBg.src = slide.imageSrc;
  imgBg.alt = '';
  imgBg.setAttribute('aria-hidden', 'true');
  imgBg.draggable = false;

  const imgFg = document.createElement('img');
  imgFg.className = 'hero-carousel__image hero-carousel__image--fg';
  imgFg.src = slide.imageSrc;
  imgFg.alt = slide.imageAlt;
  imgFg.loading = isActive ? 'eager' : 'lazy';
  imgFg.draggable = false;

  media.append(imgBg, imgFg);

  if (slide.productImageSrc) {
    const product = document.createElement('img');
    product.className = 'hero-carousel__product';
    product.src = slide.productImageSrc;
    product.alt = slide.productImageAlt ?? '';
    product.loading = isActive ? 'eager' : 'lazy';
    product.draggable = false;
    media.appendChild(product);
  }

  const overlay = document.createElement('div');
  overlay.className = 'hero-carousel__overlay';

  const overlayStyle = slide.overlayStyle ?? 'left-heavy';
  if (overlayStyle === 'right-heavy') {
    overlay.classList.add('hero-carousel__overlay--right-heavy');
  } else if (overlayStyle === 'minimal') {
    overlay.classList.add('hero-carousel__overlay--minimal');
  }

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'hero-carousel__content';

  const contentAlign = slide.contentAlign ?? 'left';
  if (contentAlign === 'center') {
    contentWrapper.classList.add('hero-carousel__content--center');
  } else if (contentAlign === 'right') {
    contentWrapper.classList.add('hero-carousel__content--right');
  }

  const headline = document.createElement('h1');
  headline.className = 'hero-carousel__headline';
  headline.textContent = slide.headline;

  const subtitle = document.createElement('p');
  subtitle.className = 'hero-carousel__subtitle';
  subtitle.textContent = slide.subtitle;

  const cta = document.createElement('a');
  cta.className = 'btn btn--primary hero-carousel__cta';
  cta.href = slide.ctaHref;
  cta.textContent = slide.ctaLabel;

  contentWrapper.append(headline, subtitle, cta);
  overlay.appendChild(contentWrapper);
  el.append(media, overlay);

  return el;
}

function startTabProgress(tab: HTMLElement): void {
  const progress = tab.querySelector<HTMLElement>('.hero-carousel__tab-progress');
  if (!progress) return;
  progress.style.animation = 'none';
  void progress.offsetHeight;
  progress.style.animation = `heroTabProgress ${AUTO_ROTATE_INTERVAL}ms linear forwards`;
}

function stopTabProgress(tab: HTMLElement): void {
  const progress = tab.querySelector<HTMLElement>('.hero-carousel__tab-progress');
  if (!progress) return;
  progress.style.animation = 'none';
}

function initializeCarousel(container: HTMLElement, slideCount: number): void {
  const slidesWrapper = container.querySelector<HTMLElement>('.hero-carousel__slides');
  const slides = container.querySelectorAll<HTMLElement>('.hero-carousel__slide');
  const tabs = container.querySelectorAll<HTMLElement>('.hero-carousel__tab');
  const prevBtn = container.querySelector<HTMLElement>('.hero-carousel__nav-btn--prev');
  const nextBtn = container.querySelector<HTMLElement>('.hero-carousel__nav-btn--next');

  if (slides.length === 0) return;

  let currentIndex = 0;
  let isPointerInside = false;
  let hasFocusInside = false;
  let intervalId: ReturnType<typeof setInterval> | undefined;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function isAutoRotatePaused(): boolean {
    return prefersReducedMotion || isPointerInside || hasFocusInside;
  }

  function resetAutoRotate(): void {
    clearInterval(intervalId);
    if (isAutoRotatePaused()) return;
    intervalId = setInterval(() => {
      goToSlide((currentIndex + 1) % slideCount);
    }, AUTO_ROTATE_INTERVAL);
  }

  function goToSlide(index: number): void {
    stopTabProgress(tabs[currentIndex]);
    slides[currentIndex].classList.remove('hero-carousel__slide--active');
    tabs[currentIndex].classList.remove('hero-carousel__tab--active');
    tabs[currentIndex].setAttribute('aria-current', 'false');

    currentIndex = index;

    slides[currentIndex].classList.add('hero-carousel__slide--active');
    tabs[currentIndex].classList.add('hero-carousel__tab--active');
    tabs[currentIndex].setAttribute('aria-current', 'true');
    if (!isAutoRotatePaused()) {
      startTabProgress(tabs[currentIndex]);
    }
  }

  function goToPrev(): void {
    goToSlide((currentIndex - 1 + slideCount) % slideCount);
    resetAutoRotate();
  }

  function goToNext(): void {
    goToSlide((currentIndex + 1) % slideCount);
    resetAutoRotate();
  }

  prevBtn?.addEventListener('click', goToPrev);
  nextBtn?.addEventListener('click', goToNext);

  function pauseAutoRotate(): void {
    clearInterval(intervalId);
    stopTabProgress(tabs[currentIndex]);
  }

  function resumeAutoRotate(): void {
    if (isAutoRotatePaused()) return;
    startTabProgress(tabs[currentIndex]);
    resetAutoRotate();
  }

  container.addEventListener('mouseenter', () => {
    isPointerInside = true;
    pauseAutoRotate();
  });
  container.addEventListener('mouseleave', () => {
    isPointerInside = false;
    resumeAutoRotate();
  });
  container.addEventListener('focusin', () => {
    hasFocusInside = true;
    pauseAutoRotate();
  });
  container.addEventListener('focusout', (event) => {
    if (!container.contains(event.relatedTarget as Node | null)) {
      hasFocusInside = false;
      resumeAutoRotate();
    }
  });

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      if (i !== currentIndex) {
        goToSlide(i);
        resetAutoRotate();
      }
    });
  });

  if (slidesWrapper) {
    initSwipeDrag(slidesWrapper, goToPrev, goToNext);
  }

  tabs[0].classList.add('hero-carousel__tab--active');
  if (!prefersReducedMotion) startTabProgress(tabs[0]);
  resetAutoRotate();
}

function initSwipeDrag(
  slidesWrapper: HTMLElement,
  goToPrev: () => void,
  goToNext: () => void,
): void {
  let startX = 0;
  let isDragging = false;
  let activePointerId: number | null = null;

  slidesWrapper.style.touchAction = 'pan-y';

  const handlePointerDown = (event: PointerEvent): void => {
    if (event.button !== 0 && event.pointerType === 'mouse') {
      return;
    }

    if (event.pointerType === 'mouse') {
      event.preventDefault();
    }

    isDragging = true;
    startX = event.clientX;
    activePointerId = event.pointerId;
    slidesWrapper.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent): void => {
    if (!isDragging || activePointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - startX;
    if (Math.abs(deltaX) > 10) {
      event.preventDefault();
    }
  };

  const handlePointerEnd = (event: PointerEvent): void => {
    if (!isDragging || activePointerId !== event.pointerId) {
      return;
    }

    isDragging = false;
    const deltaX = event.clientX - startX;

    if (slidesWrapper.hasPointerCapture(event.pointerId)) {
      slidesWrapper.releasePointerCapture(event.pointerId);
    }

    activePointerId = null;

    if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  slidesWrapper.addEventListener('dragstart', (event) => {
    event.preventDefault();
  });

  slidesWrapper.addEventListener('pointerdown', handlePointerDown);
  slidesWrapper.addEventListener('pointermove', handlePointerMove);
  slidesWrapper.addEventListener('pointerup', handlePointerEnd);
  slidesWrapper.addEventListener('pointercancel', handlePointerEnd);
}
