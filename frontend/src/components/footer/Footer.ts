import companyData from '@/data/company.json';
import { NAV_ITEMS } from '@/config/navigation';
import { t, td } from '@/i18n';
import type { CompanyData } from '@/types';

const company = companyData as CompanyData;

export function createFooter(): HTMLElement {
  const footer = document.createElement('footer');
  footer.className = 'footer';

  const inner = document.createElement('div');
  inner.className = 'container footer__inner';

  const brandBlock = document.createElement('div');
  brandBlock.className = 'footer__brand';
  brandBlock.innerHTML = `
    <p class="footer__name">${company.name}</p>
    <p class="footer__tagline">${td(company, 'tagline')}</p>
  `;

  const contactBlock = document.createElement('div');
  contactBlock.className = 'footer__contact';

  const contactTitle = document.createElement('p');
  contactTitle.className = 'footer__heading';
  contactTitle.textContent = t('footer.contact');
  contactBlock.appendChild(contactTitle);

  const contactList = document.createElement('ul');
  contactList.className = 'footer__list';

  for (const channel of company.contact.slice(0, 3)) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = channel.href;
    link.textContent = `${td(channel, 'label')}: ${channel.value}`;
    item.appendChild(link);
    contactList.appendChild(item);
  }

  contactBlock.appendChild(contactList);

  const linksBlock = document.createElement('div');
  linksBlock.className = 'footer__links';

  const linksTitle = document.createElement('p');
  linksTitle.className = 'footer__heading';
  linksTitle.textContent = t('footer.links');
  linksBlock.appendChild(linksTitle);

  const linksList = document.createElement('ul');
  linksList.className = 'footer__list';

  for (const navItem of NAV_ITEMS.filter((item) => item.id !== 'home')) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = navItem.href;
    link.textContent = t(navItem.labelKey);
    item.appendChild(link);
    linksList.appendChild(item);
  }

  linksBlock.appendChild(linksList);

  const bar = document.createElement('div');
  bar.className = 'footer__bar';

  const copy = document.createElement('p');
  copy.className = 'footer__copy';
  copy.textContent = t('footer.copy');

  bar.appendChild(copy);
  inner.append(brandBlock, contactBlock, linksBlock);
  footer.append(inner, bar);

  return footer;
}
