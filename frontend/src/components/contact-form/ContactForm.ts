import { t } from '@/i18n';

export function createContactForm(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'contact-form';

  section.innerHTML = `
    <form class="contact-form__form" id="contact-form" novalidate>
      <div class="contact-form__field">
        <label class="contact-form__label" for="contact-name">${t('form.name')}</label>
        <input class="contact-form__input" id="contact-name" name="name" type="text" required autocomplete="name" />
      </div>
      <div class="contact-form__field">
        <label class="contact-form__label" for="contact-email">${t('form.email')}</label>
        <input class="contact-form__input" id="contact-email" name="email" type="email" required autocomplete="email" />
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

  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  return section;
}

function handleFormSubmit(event: SubmitEvent): void {
  event.preventDefault();
  alert(t('form.alert'));
}
