import '@/styles/main.scss';
import { createContactForm } from '@/components/contact-form/ContactForm';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import {
  renderContactChannels,
  renderFaq,
} from '@/pages/contact/renderContact';
import { mountLayout } from '@/utils/mountLayout';

function renderContactPage(): void {
  const main = document.getElementById('page-content');

  if (!main) {
    return;
  }

  const header = document.createElement('section');
  header.className = 'page-header';
  header.appendChild(
    createSectionTitle({
      eyebrow: 'Contact',
      title: 'Get in Touch',
      description: 'Reach us directly by email, phone, WhatsApp, WeChat, or QQ.',
    }),
  );

  const contactSection = document.createElement('section');
  contactSection.className = 'section';
  const contactContainer = document.createElement('div');
  contactContainer.className = 'container contact-layout';

  const channelsMount = document.createElement('div');
  channelsMount.id = 'contact-channels';

  const formMount = document.createElement('div');
  formMount.appendChild(createContactForm());

  contactContainer.append(channelsMount, formMount);
  contactSection.appendChild(contactContainer);

  const faqSection = document.createElement('section');
  faqSection.className = 'section section--muted';
  const faqContainer = document.createElement('div');
  faqContainer.className = 'container';
  faqContainer.appendChild(
    createSectionTitle({
      eyebrow: 'FAQ',
      title: 'Common Questions',
    }),
  );
  const faqMount = document.createElement('div');
  faqMount.id = 'contact-faq';
  faqContainer.appendChild(faqMount);
  faqSection.appendChild(faqContainer);

  main.replaceChildren(header, contactSection, faqSection);

  renderContactChannels(channelsMount);
  renderFaq(faqMount);
}

mountLayout('contact');
renderContactPage();
