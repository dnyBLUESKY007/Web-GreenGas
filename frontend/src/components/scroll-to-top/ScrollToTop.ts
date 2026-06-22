const SHOW_THRESHOLD = 400;
const SCROLL_DURATION = 400;

export function createScrollToTop(): HTMLElement {
  const button = document.createElement('button');
  button.className = 'scroll-to-top';
  button.setAttribute('aria-label', 'Scroll to top');
  button.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>`;

  const handleScroll = (): void => {
    button.classList.toggle('scroll-to-top--visible', window.scrollY > SHOW_THRESHOLD);
  };

  const handleClick = (): void => {
    const startY = window.scrollY;
    if (startY === 0) return;

    const startTime = performance.now();

    const step = (currentTime: number): void => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / SCROLL_DURATION, 1);

      window.scrollTo(0, startY * (1 - progress));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  button.addEventListener('click', handleClick);
  window.addEventListener('scroll', handleScroll, { passive: true });

  handleScroll();

  return button;
}
