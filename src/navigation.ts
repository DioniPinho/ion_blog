import {
  createLocalizedPathnamesNavigation,
  Pathnames
} from 'next-intl/navigation';
import { locales } from './i18n';

export const pathnames = {
  '/': '/',
  '/posts': '/posts',
  '/categories': '/categories',
  '/tags': '/tags',
  '/about': '/about'
} satisfies Pathnames<typeof locales>;

export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({ locales, pathnames }); 