import companyData from '@/data/company.json';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import { t, td } from '@/i18n';
import type { CompanyData } from '@/types';

const company = companyData as CompanyData;

/**
 * Parses a stat value like "100+", "24h", "500m²" into
 * a numeric part and suffix string.
 */
function parseStatValue(raw: string): { numeric: number; suffix: string } {
  const match = /^(\d+(?:\.\d+)?)(.*)$/.exec(raw);

  if (!match) {
    return { numeric: 0, suffix: raw };
  }

  return { numeric: parseFloat(match[1]), suffix: match[2] };
}

export function createStatsBand(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'section section--light stats-band';

  const container = document.createElement('div');
  container.className = 'container';

  const header = createSectionTitle({
    eyebrow: t('home.stats.eyebrow'),
    title: t('home.stats.title'),
    description: t('home.stats.desc'),
  });
  header.classList.add('stats-band__header');

  const grid = document.createElement('div');
  grid.className = 'stats-band__grid';

  for (const stat of company.stats) {
    const item = document.createElement('div');
    item.className = 'stats-band__item';

    const { suffix } = parseStatValue(stat.value);

    const valueEl = document.createElement('span');
    valueEl.className = 'stats-band__value';
    valueEl.textContent = '0';

    const fullValue = document.createElement('p');
    fullValue.className = 'stats-band__number';
    fullValue.appendChild(valueEl);
    fullValue.appendChild(document.createTextNode(suffix));

    const label = document.createElement('p');
    label.className = 'stats-band__label';
    label.textContent = td(stat, 'label');

    item.appendChild(fullValue);
    item.appendChild(label);
    grid.appendChild(item);
  }

  container.append(header, grid);
  section.appendChild(container);

  initCounter(grid, company.stats.map((s) => parseStatValue(s.value).numeric));

  return section;
}

/**
 * Entry: activate counting when the grid scrolls into view.
 */
function initCounter(grid: HTMLElement, targets: readonly number[]): void {
  const valueEls = grid.querySelectorAll('.stats-band__value') as NodeListOf<HTMLElement>;

  if (valueEls.length === 0 || targets.length === 0) {
    return;
  }

  let triggered = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (triggered) {
        return;
      }

      for (const entry of entries) {
        if (entry.isIntersecting) {
          triggered = true;
          observer.disconnect();
          animateCounters(valueEls, targets, 1600);
          break;
        }
      }
    },
    { threshold: 0.3 },
  );

  observer.observe(grid);
}

/**
 * Animate counter values from 0 → target over duration (ms).
 */
function animateCounters(
  elements: NodeListOf<HTMLElement>,
  targets: readonly number[],
  duration: number,
): void {
  const steps = 40;
  const interval = duration / steps;
  const current = new Array(targets.length).fill(0);
  let frame = 0;

  const tick = (): void => {
    frame++;
    const progress = Math.min(frame / steps, 1);

    for (let i = 0; i < elements.length; i++) {
      current[i] = Math.round(progress * targets[i]);

      const el = elements[i];

      if (el) {
        el.textContent = String(current[i]);
      }
    }

    if (frame < steps) {
      requestAnimationFrame(() => {
        setTimeout(tick, interval);
      });
    }
  };

  tick();
}
