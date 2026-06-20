import companyData from '@/data/company.json';
import type { CompanyData } from '@/types';

const company = companyData as CompanyData;

export function renderStats(container: HTMLElement): void {
  const grid = document.createElement('div');
  grid.className = 'stats-grid';

  for (const stat of company.stats) {
    const item = document.createElement('div');
    item.className = 'stat-item';
    item.innerHTML = `
      <p class="stat-item__value">${stat.value}</p>
      <p class="stat-item__label">${stat.label}</p>
    `;
    grid.appendChild(item);
  }

  container.replaceChildren(grid);
}

export function renderFaq(container: HTMLElement): void {
  const list = document.createElement('div');
  list.className = 'faq-list';

  for (const item of company.faq) {
    const details = document.createElement('details');
    details.className = 'faq-item';
    details.innerHTML = `
      <summary class="faq-item__question">${item.question}</summary>
      <p class="faq-item__answer">${item.answer}</p>
    `;
    list.appendChild(details);
  }

  container.replaceChildren(list);
}

export function renderContactChannels(container: HTMLElement): void {
  const list = document.createElement('ul');
  list.className = 'contact-channels';

  for (const channel of company.contact) {
    const item = document.createElement('li');
    item.className = 'contact-channels__item';

    const link = document.createElement('a');
    link.className = 'contact-channels__link';
    link.href = channel.href;
    link.textContent = channel.value;

    const label = document.createElement('span');
    label.className = 'contact-channels__label';
    label.textContent = channel.label;

    item.append(label, link);
    list.appendChild(item);
  }

  container.replaceChildren(list);
}
