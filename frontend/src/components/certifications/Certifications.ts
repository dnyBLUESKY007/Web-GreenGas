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
      const img = document.createElement('img');
      img.className = 'certifications__image';
      img.src = cdnUrl(cert.imageCategory, cert.image);
      img.alt = certificationName;
      img.loading = 'lazy';
      card.appendChild(img);
    } else {
      const pendingLabel = t('about.media.pending');
      const placeholder = document.createElement('div');
      placeholder.className = 'certifications__placeholder';
      placeholder.textContent = pendingLabel;
      placeholder.setAttribute('role', 'img');
      placeholder.setAttribute('aria-label', `${certificationName} — ${pendingLabel}`);
      card.appendChild(placeholder);
    }

    if (cert.validityStatus === 'historical') {
      const validity = document.createElement('span');
      validity.className = 'certifications__validity';
      validity.innerHTML = `${t('home.certifications.historical')}<br><time datetime="${cert.validFrom}">${cert.validFrom}</time>–<time datetime="${cert.validUntil}">${cert.validUntil}</time>`;
      caption.appendChild(validity);
    }
    card.appendChild(caption);
    track.appendChild(card);
  }

  container.append(header, track);
  section.appendChild(container);

  return section;
}
