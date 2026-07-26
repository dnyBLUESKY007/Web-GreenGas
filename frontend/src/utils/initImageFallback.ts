import { t } from '@/i18n';

let isInitialized = false;

export function initImageFallback(): void {
  if (isInitialized) return;

  document.addEventListener(
    'error',
    (event) => {
      const image = event.target;
      if (!(image instanceof HTMLImageElement)) return;
      if (image.nextElementSibling?.classList.contains('media-unavailable')) return;

      image.hidden = true;
      if (image.getAttribute('aria-hidden') === 'true') return;

      const unavailableLabel = t('media.unavailable');
      const fallback = document.createElement('span');
      fallback.className = 'media-unavailable';
      fallback.setAttribute('role', 'img');
      fallback.setAttribute('aria-label', unavailableLabel);
      fallback.textContent = unavailableLabel;
      image.insertAdjacentElement('afterend', fallback);
    },
    true,
  );
  isInitialized = true;
}
