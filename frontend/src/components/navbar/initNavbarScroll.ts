const HIDE_THRESHOLD = 100;

let isNavbarScrollInitialized = false;
let lastScrollY = 0;

export function initNavbarScroll(): void {
  if (isNavbarScrollInitialized) {
    resetNavbarState();
    return;
  }

  const navbar = document.querySelector<HTMLElement>('.navbar');
  if (!navbar) {
    return;
  }

  lastScrollY = window.scrollY;

  const handleScroll = (): void => {
    const currentNavbar = document.querySelector<HTMLElement>('.navbar');
    if (!currentNavbar) {
      return;
    }

    const currentScrollY = window.scrollY;
    const isScrolled = currentScrollY > 8;

    currentNavbar.classList.toggle('navbar--scrolled', isScrolled);

    if (currentNavbar.classList.contains('navbar--menu-open')) {
      currentNavbar.classList.remove('navbar--hidden');
      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY <= 0) {
      currentNavbar.classList.remove('navbar--hidden');
    } else if (currentScrollY > lastScrollY && currentScrollY > HIDE_THRESHOLD) {
      currentNavbar.classList.add('navbar--hidden');
    } else if (currentScrollY < lastScrollY) {
      currentNavbar.classList.remove('navbar--hidden');
    }

    lastScrollY = currentScrollY;
  };

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
  isNavbarScrollInitialized = true;
}

function resetNavbarState(): void {
  const navbar = document.querySelector<HTMLElement>('.navbar');
  if (!navbar) return;

  const currentScrollY = window.scrollY;
  lastScrollY = currentScrollY;

  navbar.classList.toggle('navbar--scrolled', currentScrollY > 8);
  navbar.classList.toggle(
    'navbar--hidden',
    !navbar.classList.contains('navbar--menu-open') && currentScrollY > HIDE_THRESHOLD,
  );
}
