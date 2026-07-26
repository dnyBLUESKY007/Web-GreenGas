import { t } from '@/i18n';

let initialized = false;

export function initImageFallback(): void {
  if (initialized) return;

  document.addEventListener(
    'error',
    (event) => {
      const image = event.target;
      if (!(image instanceof HTMLImageElement) || image.nextElementSibling?.classList.contains('media-unavailable')) {
        return;
      }

      image.hidden = true;
      if (image.getAttribute('aria-hidden') === 'true') return;

      const fallback = document.createElement('span');
      fallback.className = 'media-unavailable';
      fallback.setAttribute('role', 'img');
      fallback.setAttribute('aria-label', t('media.unavailable'));
      fallback.textContent = t('media.unavailable');
      image.insertAdjacentElement('afterend', fallback);
    },
    true,
  );
  initialized = true;
}
