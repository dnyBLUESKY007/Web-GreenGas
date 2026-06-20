export interface HeroProps {
  readonly title: string;
  readonly subtitle: string;
  readonly ctaLabel: string;
  readonly ctaHref: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
}

export function createHero(props: HeroProps): HTMLElement {
  const section = document.createElement('section');
  section.className = 'hero';

  section.innerHTML = `
    <div class="container hero__inner">
      <div class="hero__content">
        <h1 class="hero__title">${props.title}</h1>
        <p class="hero__subtitle">${props.subtitle}</p>
        <a class="btn btn--primary hero__cta" href="${props.ctaHref}">${props.ctaLabel}</a>
      </div>
      <div class="hero__media">
        <img
          class="hero__image"
          src="${props.imageSrc}"
          alt="${props.imageAlt}"
          width="640"
          height="480"
          loading="eager"
        />
      </div>
    </div>
  `;

  return section;
}
