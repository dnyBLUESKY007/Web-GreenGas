import certificationsData from '@/data/certifications.json';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { t, td } from '@/i18n';
import { cdnUrl } from '@/config/assets';
import type { Certification } from '@/types';

const certifications = certificationsData as readonly Certification[];

export function createCertifications(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section certifications';

  const container = document.createElement('div');
  container.className = 'container';

  const header = createSectionTitle({
    eyebrow: t('home.certifications.eyebrow'),
    title: t('home.certifications.title'),
    description: t('home.certifications.desc'),
  });
  header.classList.add('certifications__header');

  const track = document.createElement('div');
  track.className = 'certifications__track';

  for (const cert of certifications) {
    const certificationName = td(cert, 'name');
    const card = document.createElement('figure');
    card.className = 'certifications__card';

    const caption = document.createElement('figcaption');
    caption.className = 'certifications__name';
    caption.textContent = certificationName;

    if (cert.publicationStatus === 'approved') {
      const preview = document.createElement('button');
      preview.className = 'certifications__preview';
      preview.type = 'button';
      preview.setAttribute('aria-label', `${certificationName} — ${t('about.certifications.enlarge')}`);

      const img = document.createElement('img');
      img.className = 'certifications__image';
      img.src = cdnUrl(cert.imageCategory, cert.image);
      img.alt = certificationName;
      img.loading = 'eager';
      img.decoding = 'sync';
      preview.appendChild(img);
      preview.addEventListener('click', () => showCertificatePreview(img.src, certificationName));
      card.appendChild(preview);
    } else {
      const pendingLabel = t('about.media.pending');
      const placeholder = document.createElement('div');
      placeholder.className = 'certifications__placeholder';
      placeholder.textContent = pendingLabel;
      placeholder.setAttribute('role', 'img');
      placeholder.setAttribute('aria-label', `${certificationName} — ${pendingLabel}`);
      card.appendChild(placeholder);
    }

    card.appendChild(caption);
    track.appendChild(card);
  }

  container.append(header, track);
  section.appendChild(container);

  return section;
}

function showCertificatePreview(src: string, alt: string): void {
  const dialog = document.createElement('dialog');
  dialog.className = 'certifications__dialog';

  const close = document.createElement('button');
  close.className = 'certifications__dialog-close';
  close.type = 'button';
  close.textContent = t('about.certifications.close');
  close.addEventListener('click', () => dialog.close());

  const image = document.createElement('img');
  image.src = src;
  image.alt = alt;

  dialog.append(close, image);
  dialog.addEventListener('click', ({ target }) => {
    if (target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => dialog.remove());
  document.body.appendChild(dialog);
  dialog.showModal();
}
