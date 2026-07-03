import clientsData from '@/data/clients.json';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { t, td } from '@/i18n';
import type { ClientIndustry } from '@/types';

const clients = clientsData as readonly ClientIndustry[];

export function createClientLogos(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section section--light client-logos';

  const container = document.createElement('div');
  container.className = 'container';

  const header = createSectionTitle({
    eyebrow: t('home.clients.eyebrow'),
    title: t('home.clients.title'),
    description: t('home.clients.desc'),
  });
  header.classList.add('client-logos__header');

  const grid = document.createElement('div');
  grid.className = 'client-logos__grid';

  for (const client of clients) {
    const tile = document.createElement('div');
    tile.className = 'client-logos__tile';
    tile.textContent = td(client, 'name');
    grid.appendChild(tile);
  }

  container.append(header, grid);
  section.appendChild(container);

  return section;
}
