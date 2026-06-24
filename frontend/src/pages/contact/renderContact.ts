import companyData from '@/data/company.json';
import { td } from '@/i18n';
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
      <p class="stat-item__label">${td(stat, 'label')}</p>
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
      <summary class="faq-item__question">${td(item, 'question')}</summary>
      <p class="faq-item__answer">${td(item, 'answer')}</p>
    `;
    list.appendChild(details);
  }

  container.replaceChildren(list);
}

const CHANNEL_ICON_MAP: Readonly<Record<string, string>> = {
  Email: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  Phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  WhatsApp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  WeChat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/></svg>`,
  QQ: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 2.21.715 4.254 1.926 5.918L2 22l4.082-1.926A9.957 9.957 0 0 0 12 22z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/></svg>`,
};

const DEFAULT_CHANNEL_ICON = CHANNEL_ICON_MAP.Email;

function getChannelIcon(label: string): string {
  return CHANNEL_ICON_MAP[label] ?? DEFAULT_CHANNEL_ICON;
}

// [联系方式] Contact channels block
export function renderContactChannels(container: HTMLElement): void {
  const list = document.createElement('div');
  list.className = 'channel-list';

  for (const channel of company.contact) {
    const card = document.createElement('article');
    card.className = 'channel-card';

    const icon = document.createElement('div');
    icon.className = 'channel-card__icon';
    icon.innerHTML = getChannelIcon(channel.label);

    const body = document.createElement('div');
    body.className = 'channel-card__body';

    const label = document.createElement('strong');
    label.className = 'channel-card__label';
    label.textContent = td(channel, 'label');

    const link = document.createElement('a');
    link.className = 'channel-card__value';
    link.href = channel.href;
    link.textContent = channel.value;

    body.append(label, link);
    card.append(icon, body);
    list.appendChild(card);
  }

  container.replaceChildren(list);
}
