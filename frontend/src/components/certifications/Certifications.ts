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
    const card = document.createElement('figure');
    card.className = 'certifications__card';

    const caption = document.createElement('figcaption');
    caption.className = 'certifications__name';
    caption.textContent = td(cert, 'name');

    if (cert.publicationStatus === 'approved') {
      const img = document.createElement('img');
      img.className = 'certifications__image';
      img.src = cdnUrl('company', cert.image);
      img.alt = td(cert, 'name');
      img.loading = 'lazy';
      card.appendChild(img);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'certifications__placeholder';
      placeholder.textContent = t('about.media.pending');
      placeholder.setAttribute('role', 'img');
      placeholder.setAttribute('aria-label', `${td(cert, 'name')} — ${t('about.media.pending')}`);
      card.appendChild(placeholder);
    }

    card.appendChild(caption);
    track.appendChild(card);
  }

  container.append(header, track);
  section.appendChild(container);

  return section;
}
