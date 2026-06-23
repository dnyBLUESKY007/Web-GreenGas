import '@/styles/main.scss';
import { createContactForm } from '@/components/contact-form/ContactForm';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { t } from '@/i18n';
import {
  renderContactChannels,
  renderFaq,
} from '@/pages/contact/renderContact';
import { initPage } from '@/utils/mountLayout';

function renderContactPage(): void {
  const main = document.getElementById('page-content');

  if (!main) {
    return;
  }

  const header = document.createElement('section');
  header.className = 'page-header';
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

  const channelsMount = document.createElement('div');
  channelsMount.id = 'contact-channels';

  const formMount = document.createElement('div');
  formMount.appendChild(createContactForm());

  contactLayout.append(channelsMount, formMount);
  contactContainer.appendChild(contactLayout);
  contactSection.appendChild(contactContainer);

  const faqSection = document.createElement('section');
  faqSection.className = 'section section--muted';
  const faqContainer = document.createElement('div');
  faqContainer.className = 'container';
  const faqContent = document.createElement('div');
  faqContent.className = 'faq-section-content';
  faqContent.appendChild(
    createSectionTitle({
      eyebrow: t('contact.faq.eyebrow'),
      title: t('contact.faq.title'),
    }),
  );
  const faqMount = document.createElement('div');
  faqMount.id = 'contact-faq';
  faqContent.appendChild(faqMount);
  faqContainer.appendChild(faqContent);
  faqSection.appendChild(faqContainer);

  main.replaceChildren(header, contactSection, faqSection);

  renderContactChannels(channelsMount);
  renderFaq(faqMount);
}

initPage('contact', renderContactPage);
