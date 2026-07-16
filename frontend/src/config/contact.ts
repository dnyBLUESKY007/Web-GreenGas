import companyData from '@/data/company.json';
import { getLocale } from '@/i18n';
import type { CompanyData, ContactChannel } from '@/types';

const company = companyData as CompanyData;

/**
 * Returns contact channels visible for the active locale.
 * Channels without `locales` are shown for all languages.
 */
export function getContactChannels(): readonly ContactChannel[] {
  const locale = getLocale();

  return company.contact.filter(
    (channel) => !channel.locales || channel.locales.includes(locale),
  );
}
