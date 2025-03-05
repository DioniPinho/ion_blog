export const defaultLocale = 'en';
export const locales = ['en', 'pt'] as const;

export type Locale = (typeof locales)[number];

export const pathnames = {
  '/': '/',
  '/posts': '/posts',
  '/categories': '/categories',
  '/tags': '/tags',
  '/about': '/about',
} as const;

export const localePrefix = 'always'; // Default

export type Pathnames = typeof pathnames; 