export interface SectionTitleProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
}

export function createSectionTitle(props: SectionTitleProps): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'section-title';

  if (props.eyebrow) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'section-title__eyebrow';
    eyebrow.textContent = props.eyebrow;
    wrapper.appendChild(eyebrow);
  }

  const title = document.createElement('h2');
  title.className = 'section-title__heading';
  title.textContent = props.title;
  wrapper.appendChild(title);

  if (props.description) {
    const description = document.createElement('p');
    description.className = 'section-title__description';
    description.textContent = props.description;
    wrapper.appendChild(description);
  }

  return wrapper;
}
