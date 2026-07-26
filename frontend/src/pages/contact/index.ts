import '@/styles/main.scss';
import { createContactForm } from '@/components/contact-form/ContactForm';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { setPageHeaderBackground } from '@/config/assets';
import { t } from '@/i18n';
import { renderContactChannels, renderFaq } from '@/pages/contact/renderContact';
import { initPage } from '@/utils/mountLayout';

function renderContactPage(): void {
  const main = document.getElementById('page-content');

  if (!main) {
    return;
  }

  const header = document.createElement('section');
  header.className = 'page-header';
  setPageHeaderBackground(header, '05_contact.webp');
  header.appendChild(
    createSectionTitle({
      eyebrow: t('contact.eyebrow'),
      title: t('contact.title'),
      description: t('contact.desc'),
    }),
  );

  const contactSection = document.createElement('section');
  contactSection.className = 'section';
  const contactContainer = document.createElement('div');
  contactContainer.className = 'container';

  const contactLayout = document.createElement('div');
  contactLayout.className = 'contact-layout';

  const faqSection = document.createElement('section');
  faqSection.id = 'faq';
  faqSection.className = 'section section--muted contact-faq';
  const faqContainer = document.createElement('div');
  faqContainer.className = 'container faq-section-content';
  faqContainer.appendChild(
    createSectionTitle({
      eyebrow: t('faq.eyebrow'),
      title: t('faq.title'),
      description: t('faq.desc'),
    }),
  );
  const faqMount = document.createElement('div');
  faqContainer.appendChild(faqMount);
  faqSection.appendChild(faqContainer);

  const channelsMount = document.createElement('div');
  channelsMount.id = 'contact-channels';

  const formMount = document.createElement('div');
  formMount.appendChild(createContactForm());

  contactLayout.append(channelsMount, formMount);
  contactContainer.appendChild(contactLayout);
  contactSection.appendChild(contactContainer);

  main.replaceChildren(header, faqSection, contactSection);

  renderFaq(faqMount);
  renderContactChannels(channelsMount);
}

initPage('contact', renderContactPage);
