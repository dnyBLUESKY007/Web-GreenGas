export function initNavbarScroll(): void {
  const navbar = document.querySelector<HTMLElement>('.navbar');

  if (!navbar) {
    return;
  }

  const handleScroll = (): void => {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 8);
  };

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}
