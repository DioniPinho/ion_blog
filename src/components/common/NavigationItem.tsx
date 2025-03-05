'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NavigationItemProps {
  name: string;
  href: string;
  index?: number;
  onClick?: () => void;
  className?: string;
}

export function NavigationItem({ name, href, index, onClick, className }: NavigationItemProps) {
  return (
    <motion.li
      key={name}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index ? 0.4 + index * 0.1 : 0 }}
    >
      <Link
        href={href}
        className={cn(
          'relative text-sm font-medium text-muted-foreground transition-colors hover:text-primary',
          'after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full',
          className
        )}
        onClick={onClick}
      >
        {name}
      </Link>
    </motion.li>
  );
} 