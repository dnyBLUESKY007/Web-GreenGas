import companyData from '@/data/company.json';
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
    <p class="footer__tagline">${company.tagline}</p>
  `;

  const contactBlock = document.createElement('div');
  contactBlock.className = 'footer__contact';

  const contactTitle = document.createElement('p');
  contactTitle.className = 'footer__heading';
  contactTitle.textContent = 'Contact';
  contactBlock.appendChild(contactTitle);

  const contactList = document.createElement('ul');
  contactList.className = 'footer__list';

  for (const channel of company.contact.slice(0, 3)) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = channel.href;
    link.textContent = `${channel.label}: ${channel.value}`;
    item.appendChild(link);
    contactList.appendChild(item);
  }

  contactBlock.appendChild(contactList);

  const linksBlock = document.createElement('div');
  linksBlock.className = 'footer__links';

  const linksTitle = document.createElement('p');
  linksTitle.className = 'footer__heading';
  linksTitle.textContent = 'Quick Links';
  linksBlock.appendChild(linksTitle);

  const linksList = document.createElement('ul');
  linksList.className = 'footer__list';
  linksList.innerHTML = `
    <li><a href="/solutions/">Solutions</a></li>
    <li><a href="/about/">About</a></li>
    <li><a href="/news/">News</a></li>
    <li><a href="/contact/">Contact</a></li>
  `;
  linksBlock.appendChild(linksList);

  const copy = document.createElement('p');
  copy.className = 'footer__copy';
  copy.textContent = `© ${new Date().getFullYear()} ${company.name}. All rights reserved.`;

  inner.append(brandBlock, contactBlock, linksBlock);
  footer.append(inner, copy);

  return footer;
}
