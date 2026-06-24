import '@/styles/main.scss';
import { createContactForm } from '@/components/contact-form/ContactForm';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { t } from '@/i18n';
import { renderContactChannels } from '@/pages/contact/renderContact';
import { initPage } from '@/utils/mountLayout';
import { basePath } from '@/utils/path';

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

  // [联系方式] Contact channels
  const channelsMount = document.createElement('div');
  channelsMount.id = 'contact-channels';

  // [留言板] Message board
  const formMount = document.createElement('div');
  formMount.appendChild(createContactForm());

  const faqLink = document.createElement('a');
  faqLink.className = 'contact-faq-link';
  faqLink.href = basePath('/faq/');
  faqLink.textContent = t('contact.faqLink');

  contactLayout.append(channelsMount, formMount, faqLink);
  contactContainer.appendChild(contactLayout);
  contactSection.appendChild(contactContainer);

  main.replaceChildren(header, contactSection);

  renderContactChannels(channelsMount);
}

initPage('contact', renderContactPage);
