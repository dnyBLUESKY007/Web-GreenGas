const REVEAL_SELECTOR = '.section, .page-header, .hero-intro';

let activeObserver: IntersectionObserver | null = null;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function revealElement(element: HTMLElement): void {
  element.classList.add('scroll-reveal--visible');
}

/**
 * Observes page sections and reveals them with fade-in + slide-up on scroll.
 * Re-initializes safely after locale/theme re-renders.
 */
export function initScrollReveal(root?: HTMLElement): void {
  if (activeObserver) {
    activeObserver.disconnect();
    activeObserver = null;
  }

  const container = root ?? document.getElementById('page-content');

  if (!container) {
    return;
  }

  const targets = container.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);

  if (targets.length === 0) {
    return;
  }

  if (prefersReducedMotion()) {
    for (const element of targets) {
      element.classList.add('scroll-reveal');
      revealElement(element);
    }

    return;
  }

  for (const element of targets) {
    element.classList.add('scroll-reveal');
    element.classList.remove('scroll-reveal--visible');
  }

  activeObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        const element = entry.target as HTMLElement;
        revealElement(element);
        activeObserver?.unobserve(element);
      }
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    },
  );

  for (const element of targets) {
    activeObserver.observe(element);
  }
}
