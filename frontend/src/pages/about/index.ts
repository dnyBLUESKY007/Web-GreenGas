import '@/styles/main.scss';
import { createSectionTitle } from '@/components/section-title/SectionTitle';
import companyData from '@/data/company.json';
import { mountLayout } from '@/utils/mountLayout';
import type { CompanyData } from '@/types';

const company = companyData as CompanyData;

function renderAboutPage(): void {
  const main = document.getElementById('page-content');

  if (!main) {
    return;
  }

  const header = document.createElement('section');
  header.className = 'page-header';
  header.appendChild(
    createSectionTitle({
      eyebrow: 'About',
      title: company.name,
      description: company.description,
    }),
  );

  const missionSection = document.createElement('section');
  missionSection.className = 'section';
  missionSection.innerHTML = `
    <div class="container about-block">
      <h2 class="about-block__title">Our Mission</h2>
      <p class="about-block__text">${company.mission}</p>
    </div>
  `;

  const factorySection = document.createElement('section');
  factorySection.className = 'section';
  factorySection.innerHTML = `
    <div class="container">
      <img
        class="about-block__image"
        src="/images/placeholder.svg"
        alt="GREENGAS manufacturing facility"
        width="1200"
        height="640"
        loading="lazy"
      />
    </div>
  `;

  main.replaceChildren(header, missionSection, factorySection);
}

mountLayout('about');
renderAboutPage();
