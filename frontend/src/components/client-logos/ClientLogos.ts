import clientsData from '@/data/clients.json';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { cdnUrl } from '@/config/assets';
import { t, td } from '@/i18n';
import type { PartnerCompany, PartnerGroup } from '@/types';
import { basePath } from '@/utils/path';

const partnerGroups = clientsData as readonly PartnerGroup[];

interface ClientLogosOptions {
  readonly showDestinationLink?: boolean;
}

export function createClientLogos(
  { showDestinationLink = false }: ClientLogosOptions = {},
): HTMLElement {
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

  const groupsContainer = document.createElement('div');
  groupsContainer.className = 'client-logos__groups';

  for (const partnerGroup of partnerGroups) {
    groupsContainer.appendChild(createPartnerGroup(partnerGroup));
  }

  container.appendChild(header);
  if (showDestinationLink) {
    const moreLink = document.createElement('a');
    moreLink.className = 'client-logos__more section-head__action';
    moreLink.href = basePath('/about/clients/');
    moreLink.textContent = `${t('home.clients.more')} →`;
    container.appendChild(moreLink);
  }
  container.appendChild(groupsContainer);
  section.appendChild(container);

  return section;
}

function createPartnerGroup(partnerGroup: PartnerGroup): HTMLElement {
  const groupSection = document.createElement('section');
  groupSection.className = 'client-logos__group';
  groupSection.setAttribute('aria-labelledby', `partner-group-${partnerGroup.id}`);

  const groupHeader = document.createElement('div');
  groupHeader.className = 'client-logos__group-header';

  const title = document.createElement('h3');
  title.id = `partner-group-${partnerGroup.id}`;
  title.className = 'client-logos__group-title';
  title.textContent = td(partnerGroup, 'name');

  const statusLabel = document.createElement('span');
  statusLabel.className = 'client-logos__status';
  statusLabel.textContent = t(`home.clients.status.${partnerGroup.status}`);

  const partnerList = document.createElement('ul');
  partnerList.className = 'client-logos__grid';
  for (const partner of partnerGroup.partners) {
    partnerList.appendChild(createPartnerTile(partner));
  }

  groupHeader.append(title, statusLabel);
  groupSection.append(groupHeader, partnerList);
  return groupSection;
}

function createPartnerTile(partner: PartnerCompany): HTMLLIElement {
  const tile = document.createElement('li');
  tile.className = 'client-logos__tile';

  const logoFrame = document.createElement('div');
  logoFrame.className = 'client-logos__logo-frame';

  const { logo } = partner;
  if (logo) {
    const logoImage = document.createElement('img');
    logoImage.className = 'client-logos__logo';
    logoImage.src = cdnUrl(logo.category, logo.filename);
    logoImage.alt = td(logo, 'alt');
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

  const partnerName = document.createElement('p');
  partnerName.className = 'client-logos__name';
  partnerName.textContent = td(partner, 'name');

  tile.append(logoFrame, partnerName);
  return tile;
}
