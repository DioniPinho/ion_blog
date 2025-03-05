import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'pt'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = 'en' as const;

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return {
    locale,
    messages,
    timeZone: 'America/Sao_Paulo',
    now: new Date()
  };
}); 