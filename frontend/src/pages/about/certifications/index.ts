import '@/styles/main.scss';
import { createCertifications } from '@/components/certifications/Certifications';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { t } from '@/i18n';
import { initPage } from '@/utils/mountLayout';
import { basePath } from '@/utils/path';

function renderCertificationsPage(): void {
  const main = document.getElementById('page-content');

  if (!main) {
    return;
  }

  const header = document.createElement('section');
  header.className = 'page-header';
  header.appendChild(
    createSectionTitle({
      eyebrow: t('about.certifications.eyebrow'),
      title: t('about.certifications.title'),
      description: t('about.certifications.desc'),
    }),
  );

  const backLink = document.createElement('section');
  backLink.className = 'section section--compact';
  backLink.innerHTML = `
    <div class="container">
      <a class="about-summary__link" href="${basePath('/')}">${t('about.backHome')} →</a>
    </div>
  `;

  main.replaceChildren(header, backLink, createCertifications());
}

initPage('about', renderCertificationsPage);
