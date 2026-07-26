import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { cdnUrl } from '@/config/assets';
import { getPrimaryProjectImage, projects } from '@/data/projects';
import { t, td } from '@/i18n';
import type { Project } from '@/types';
import { basePath } from '@/utils/path';

export function createCaseCarousel(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section case-carousel-section';

  const container = document.createElement('div');
  container.className = 'container';

  const head = document.createElement('div');
  head.className = 'section-head';

  const title = createSectionTitle({
    title: t('home.cases.title'),
    description: t('home.cases.desc'),
  });

  const nav = document.createElement('div');
  nav.className = 'case-carousel__nav';

  const moreLink = document.createElement('a');
  moreLink.className = 'section-head__action';
  moreLink.href = basePath('/cases/');
  moreLink.textContent = `${t('home.cases.more')} →`;

  const prevBtn = document.createElement('button');
  prevBtn.className = 'case-carousel__nav-btn';
  prevBtn.type = 'button';
  prevBtn.setAttribute('aria-label', t('carousel.prev'));
  prevBtn.textContent = '‹';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'case-carousel__nav-btn';
  nextBtn.type = 'button';
  nextBtn.setAttribute('aria-label', t('carousel.next'));
  nextBtn.textContent = '›';

  nav.append(moreLink, prevBtn, nextBtn);
  head.append(title, nav);

  const trackWrapper = document.createElement('div');
  trackWrapper.className = 'case-carousel__wrapper';

  const track = document.createElement('div');
  track.className = 'case-carousel__track';

  for (const project of projects) {
    track.appendChild(createCaseCard(project));
  }

  trackWrapper.appendChild(track);
  container.append(head, trackWrapper);
  section.appendChild(container);

  initializeCarousel(track, prevBtn, nextBtn);

  return section;
}

function createCaseCard(project: Project): HTMLElement {
  const name = td(project, 'name');
  const industry = td(project, 'industry');
  const summary = td(project, 'summary');
  const location = td(project, 'location');
  const image = getPrimaryProjectImage(project);

  const article = document.createElement('article');
  article.className = 'case-card';

  const link = document.createElement('a');
  link.className = 'case-card__link';
  link.href = `${basePath('/cases/detail/')}?id=${encodeURIComponent(project.id)}`;
  link.innerHTML = `
    <div class="case-card__media">
      <img
        class="case-card__image"
        src="${cdnUrl('projects', image.filename)}"
        alt="${td(image, 'alt')}"
        width="360"
        height="200"
        loading="lazy"
      />
    </div>
    <div class="case-card__body">
      <span class="case-card__status">${t(`cases.status.${project.status}`)}</span>
      <p class="case-card__meta">${industry} · ${location}</p>
      <h3 class="case-card__title">${name}</h3>
      <p class="case-card__summary">${summary}</p>
    </div>
  `;
  article.appendChild(link);

  return article;
}

function initializeCarousel(
  track: HTMLElement,
  prevBtn: HTMLButtonElement,
  nextBtn: HTMLButtonElement,
): void {
  function scrollByCard(direction: -1 | 1): void {
    const card = track.querySelector<HTMLElement>('.case-card');
    if (!card) return;

    const gap = 16;
    const scrollAmount = card.offsetWidth + gap;
    track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => {
    scrollByCard(-1);
  });

  nextBtn.addEventListener('click', () => {
    scrollByCard(1);
  });
}
