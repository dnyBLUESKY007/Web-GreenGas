let isNavbarScrollInitialized = false;

export function initNavbarScroll(): void {
  if (isNavbarScrollInitialized) {
    const navbar = document.querySelector<HTMLElement>('.navbar');
    if (navbar) {
      navbar.classList.toggle('navbar--scrolled', window.scrollY > 8);
    }
    return;
  }

  const navbar = document.querySelector<HTMLElement>('.navbar');

  if (!navbar) {
    return;
  }

  const handleScroll = (): void => {
    const currentNavbar = document.querySelector<HTMLElement>('.navbar');
    if (!currentNavbar) {
      return;
    }

    currentNavbar.classList.toggle('navbar--scrolled', window.scrollY > 8);
  };

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
  isNavbarScrollInitialized = true;
}
