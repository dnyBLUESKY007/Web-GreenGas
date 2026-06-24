import { t } from '@/i18n';

const ROTATING_TITLE_COUNT = 5;
const ROTATION_INTERVAL_MS = 3000;
const FADE_DURATION_MS = 300;

const ROTATING_TITLE_KEYS: readonly string[] = [
  'form.rotatingTitle.0',
  'form.rotatingTitle.1',
  'form.rotatingTitle.2',
  'form.rotatingTitle.3',
  'form.rotatingTitle.4',
] as const;

// [留言板] Message board block
export function createContactForm(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'message-board';

  section.innerHTML = `
    <h2 class="message-board__title" id="message-board-title">${t(ROTATING_TITLE_KEYS[0])}</h2>
    <form class="contact-form__form" id="contact-form" novalidate>
      <div class="contact-form__row">
        <div class="contact-form__field">
          <label class="contact-form__label" for="contact-name">${t('form.name')}</label>
          <input class="contact-form__input" id="contact-name" name="name" type="text" required autocomplete="name" />
        </div>
        <div class="contact-form__field">
          <label class="contact-form__label" for="contact-email">${t('form.email')}</label>
          <input class="contact-form__input" id="contact-email" name="email" type="email" required autocomplete="email" />
        </div>
      </div>
      <div class="contact-form__field">
        <label class="contact-form__label" for="contact-message">${t('form.message')}</label>
        <textarea class="contact-form__textarea" id="contact-message" name="message" rows="5" required></textarea>
      </div>
      <button class="btn btn--primary contact-form__submit" type="submit">${t('form.submit')}</button>
      <p class="contact-form__note">${t('form.note')}</p>
    </form>
  `;

  const form = section.querySelector<HTMLFormElement>('#contact-form');
  const titleEl = section.querySelector<HTMLElement>('#message-board-title');

  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  if (titleEl) {
    startTitleRotation(titleEl);
  }

  return section;
}

let rotationTimer: number | undefined;

function startTitleRotation(titleEl: HTMLElement): void {
  if (rotationTimer !== undefined) {
    window.clearInterval(rotationTimer);
  }

  let currentIndex = 0;

  rotationTimer = window.setInterval(() => {
    titleEl.classList.add('message-board__title--hidden');

    window.setTimeout(() => {
      currentIndex = (currentIndex + 1) % ROTATING_TITLE_COUNT;
      titleEl.textContent = t(ROTATING_TITLE_KEYS[currentIndex]);
      titleEl.classList.remove('message-board__title--hidden');
    }, FADE_DURATION_MS);
  }, ROTATION_INTERVAL_MS);
}

function handleFormSubmit(event: SubmitEvent): void {
  event.preventDefault();
  alert(t('form.alert'));
}
