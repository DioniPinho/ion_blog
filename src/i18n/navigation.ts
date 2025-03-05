import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales } from '.';

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
};

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix }); 