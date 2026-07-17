import projectsData from '@/data/projects.json';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { t, td } from '@/i18n';
import type { Project } from '@/types';

export function createCaseCarousel(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section case-carousel-section home-screen home-screen--cases';

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

  nav.append(prevBtn, nextBtn);
  head.append(title, nav);

  const trackWrapper = document.createElement('div');
  trackWrapper.className = 'case-carousel__wrapper';

  const track = document.createElement('div');
  track.className = 'case-carousel__track';

  const projects = projectsData as readonly Project[];

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

  const article = document.createElement('article');
  article.className = 'case-card';

  article.innerHTML = `
    <div class="case-card__media">
      <img
        class="case-card__image"
        src="${project.image}"
        alt="${name}"
        width="360"
        height="200"
        loading="lazy"
      />
    </div>
    <div class="case-card__body">
      <p class="case-card__meta">${industry} · ${project.location}</p>
      <h3 class="case-card__title">${name}</h3>
      <p class="case-card__summary">${summary}</p>
    </div>
  `;

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
