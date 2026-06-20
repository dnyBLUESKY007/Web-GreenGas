import type { PageId, PageMeta } from '@/types';

const DEFAULT_OG_IMAGE = '/images/placeholder.svg';

export const PAGE_META: Record<PageId, PageMeta> = {
  home: {
    title: 'Custom Cooling Systems for Industrial Facilities | GREENGAS',
    description:
      'GREENGAS designs and installs custom industrial refrigeration and HVAC systems for factories, marine, and specialized environments.',
    ogTitle: 'Custom Cooling Systems for Industrial Facilities',
    ogDescription:
      'Engineering-led cooling solutions for industrial facilities. 300+ projects delivered.',
    ogImage: DEFAULT_OG_IMAGE,
  },
  solutions: {
    title: 'Industrial Cooling Solutions | GREENGAS',
    description:
      'Marine HVAC, factory cooling, high-temperature, and explosion-proof systems engineered for your application.',
    ogTitle: 'Industrial Cooling Solutions',
    ogDescription: 'Explore cooling solutions by application: marine, factory, high-temp, explosion-proof.',
    ogImage: DEFAULT_OG_IMAGE,
  },
  about: {
    title: 'About GREENGAS | Industrial HVAC Engineering',
    description:
      'Learn about GREENGAS — our history, mission, engineering team, and manufacturing capabilities.',
    ogTitle: 'About GREENGAS',
    ogDescription: 'Industrial refrigeration engineering with 15+ years of project delivery experience.',
    ogImage: DEFAULT_OG_IMAGE,
  },
  contact: {
    title: 'Contact GREENGAS | Request a Consultation',
    description:
      'Reach GREENGAS by email, phone, WhatsApp, WeChat, or QQ. FAQ included.',
    ogTitle: 'Contact GREENGAS',
    ogDescription: 'Get in touch for custom industrial cooling system consultation.',
    ogImage: DEFAULT_OG_IMAGE,
  },
  news: {
    title: 'News & Updates | GREENGAS',
    description: 'Product updates, project milestones, and company news from GREENGAS.',
    ogTitle: 'GREENGAS News',
    ogDescription: 'Latest updates from GREENGAS industrial cooling projects.',
    ogImage: DEFAULT_OG_IMAGE,
  },
};

export function applyPageMeta(pageId: PageId): void {
  const meta = PAGE_META[pageId];

  document.title = meta.title;

  setMetaTag('name', 'description', meta.description);
  setMetaTag('property', 'og:title', meta.ogTitle);
  setMetaTag('property', 'og:description', meta.ogDescription);
  setMetaTag('property', 'og:image', meta.ogImage);
  setMetaTag('property', 'og:type', 'website');
}

function setMetaTag(
  attribute: 'name' | 'property',
  key: string,
  content: string,
): void {
  let element = document.querySelector(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}
