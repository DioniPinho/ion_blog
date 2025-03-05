import { Pathnames } from 'next-intl/navigation';

export const locales = ['en', 'pt'] as const;
export const defaultLocale = 'en' as const;
export const localePrefix = 'always';

export type AppPathnames = {
  '/': '/';
  '/posts': '/posts';
  '/categories': '/categories';
  '/tags': '/tags';
  '/about': '/about';
};

export const pathnames = {
  '/': '/',
  '/posts': '/posts',
  '/categories': '/categories',
  '/tags': '/tags',
  '/about': '/about',
} satisfies Pathnames<AppPathnames>; 