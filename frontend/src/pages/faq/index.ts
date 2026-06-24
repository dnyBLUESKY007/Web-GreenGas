import '@/styles/main.scss';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { t } from '@/i18n';
import { renderFaq } from '@/pages/contact/renderContact';
import { initPage } from '@/utils/mountLayout';

function renderFaqPage(): void {
  const main = document.getElementById('page-content');

  if (!main) {
    return;
  }

  const header = document.createElement('section');
  header.className = 'page-header';
  header.appendChild(
    createSectionTitle({
      eyebrow: t('faq.eyebrow'),
      title: t('faq.title'),
      description: t('faq.desc'),
    }),
  );

  const faqSection = document.createElement('section');
  faqSection.className = 'section';
  const faqContainer = document.createElement('div');
  faqContainer.className = 'container';
  const faqContent = document.createElement('div');
  faqContent.className = 'faq-section-content';
  const faqMount = document.createElement('div');
  faqMount.id = 'faq-list';
  faqContent.appendChild(faqMount);
  faqContainer.appendChild(faqContent);
  faqSection.appendChild(faqContainer);

  main.replaceChildren(header, faqSection);

  renderFaq(faqMount);
}

initPage('faq', renderFaqPage);
