import clientsData from '@/data/clients.json';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { cdnUrl } from '@/config/assets';
import { t, td } from '@/i18n';
import type { PartnerCompany, PartnerGroup } from '@/types';

const partnerGroups = clientsData as readonly PartnerGroup[];

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

  const groups = document.createElement('div');
  groups.className = 'client-logos__groups';

  for (const partnerGroup of partnerGroups) {
    groups.appendChild(createPartnerGroup(partnerGroup));
  }

  container.append(header, groups);
  section.appendChild(container);

  return section;
}

function createPartnerGroup(partnerGroup: PartnerGroup): HTMLElement {
  const group = document.createElement('section');
  group.className = 'client-logos__group';
  group.setAttribute('aria-labelledby', `partner-group-${partnerGroup.id}`);

  const groupHeader = document.createElement('div');
  groupHeader.className = 'client-logos__group-header';

  const title = document.createElement('h3');
  title.id = `partner-group-${partnerGroup.id}`;
  title.className = 'client-logos__group-title';
  title.textContent = td(partnerGroup, 'name');

  const status = document.createElement('span');
  status.className = 'client-logos__status';
  status.textContent = t(`home.clients.status.${partnerGroup.status}`);

  const grid = document.createElement('ul');
  grid.className = 'client-logos__grid';
  for (const partner of partnerGroup.partners) {
    grid.appendChild(createPartnerTile(partner));
  }

  groupHeader.append(title, status);
  group.append(groupHeader, grid);
  return group;
}

function createPartnerTile(partner: PartnerCompany): HTMLLIElement {
  const tile = document.createElement('li');
  tile.className = 'client-logos__tile';

  const logoFrame = document.createElement('div');
  logoFrame.className = 'client-logos__logo-frame';

  if (partner.logo) {
    const logoImage = document.createElement('img');
    logoImage.className = 'client-logos__logo';
    logoImage.src = cdnUrl(partner.logo.category, partner.logo.filename);
    logoImage.alt = td(partner.logo, 'alt');
    logoImage.loading = 'lazy';
    logoImage.decoding = 'async';
    logoFrame.appendChild(logoImage);
  } else {
    const placeholder = document.createElement('span');
    placeholder.className = 'client-logos__placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.textContent = 'LOGO';
    logoFrame.appendChild(placeholder);
  }

  const name = document.createElement('p');
  name.className = 'client-logos__name';
  name.textContent = td(partner, 'name');

  tile.append(logoFrame, name);
  return tile;
}
