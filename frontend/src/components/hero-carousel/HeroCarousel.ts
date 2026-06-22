export interface HeroSlide {
  readonly headline: string;
  readonly subtitle: string;
  readonly ctaLabel: string;
  readonly ctaHref: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
}

export const AUTO_ROTATE_INTERVAL = 6000;

export function createHeroCarousel(slides: readonly HeroSlide[]): HTMLElement {
  const container = document.createElement('section');
  container.className = 'hero-carousel';

  const slidesWrapper = document.createElement('div');
  slidesWrapper.className = 'hero-carousel__slides';

  for (let i = 0; i < slides.length; i++) {
    const slide = createSlideElement(slides[i], i === 0);
    slidesWrapper.appendChild(slide);
  }

  const tabs = document.createElement('div');
  tabs.className = 'hero-carousel__tabs';

  for (let i = 0; i < slides.length; i++) {
    const tab = document.createElement('button');
    tab.className = 'hero-carousel__tab';
    tab.setAttribute('aria-label', `Slide ${i + 1}`);
    tab.dataset.index = String(i);

    const progress = document.createElement('span');
    progress.className = 'hero-carousel__tab-progress';
    tab.appendChild(progress);

    tabs.appendChild(tab);
  }

  container.append(slidesWrapper, tabs);

  initializeCarousel(container, slides.length);

  return container;
}

function createSlideElement(slide: HeroSlide, isActive: boolean): HTMLElement {
  const el = document.createElement('div');
  el.className = 'hero-carousel__slide';

  if (isActive) {
    el.classList.add('hero-carousel__slide--active');
  }

  const img = document.createElement('img');
  img.className = 'hero-carousel__image';
  img.src = slide.imageSrc;
  img.alt = slide.imageAlt;
  img.loading = 'lazy';

  const overlay = document.createElement('div');
  overlay.className = 'hero-carousel__overlay';

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'hero-carousel__content';

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
  el.append(img, overlay);

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
  const slides = container.querySelectorAll<HTMLElement>('.hero-carousel__slide');
  const tabs = container.querySelectorAll<HTMLElement>('.hero-carousel__tab');

  if (slides.length === 0) return;

  let currentIndex = 0;
  let intervalId: ReturnType<typeof setInterval> | undefined;

  function resetAutoRotate(): void {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      goToSlide((currentIndex + 1) % slideCount);
    }, AUTO_ROTATE_INTERVAL);
  }

  function goToSlide(index: number): void {
    stopTabProgress(tabs[currentIndex]);
    slides[currentIndex].classList.remove('hero-carousel__slide--active');
    tabs[currentIndex].classList.remove('hero-carousel__tab--active');

    currentIndex = index;

    slides[currentIndex].classList.add('hero-carousel__slide--active');
    tabs[currentIndex].classList.add('hero-carousel__tab--active');
    startTabProgress(tabs[currentIndex]);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      if (i !== currentIndex) {
        goToSlide(i);
        resetAutoRotate();
      }
    });

    tab.addEventListener('mouseenter', () => {
      if (i === currentIndex) {
        clearInterval(intervalId);
        stopTabProgress(tab);
      }
    });

    tab.addEventListener('mouseleave', () => {
      if (i === currentIndex) {
        startTabProgress(tab);
        resetAutoRotate();
      }
    });
  });

  // Activate first tab and start
  tabs[0].classList.add('hero-carousel__tab--active');
  startTabProgress(tabs[0]);
  resetAutoRotate();
}
