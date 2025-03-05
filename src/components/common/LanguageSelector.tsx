'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const languages = {
  en: {
    name: 'EN',
    flag: '🇺🇸'
  },
  pt: {
    name: 'PT',
    flag: '🇧🇷'
  }
};

export function LanguageSelector() {
  const locale = useLocale();

  return (
    <div className="flex items-center gap-1">
      {Object.entries(languages).map(([code, lang]) => (
        <motion.div
          key={code}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/"
            locale={code}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1.5 rounded-full text-sm font-medium transition-all",
              locale === code
                ? "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400"
                : "text-gray-600 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400"
            )}
          >
            <span className="text-base">{lang.flag}</span>
            <span className="text-xs font-semibold">{lang.name}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
} 