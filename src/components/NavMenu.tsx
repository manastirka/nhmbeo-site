'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { nav } from '@/lib/nav';

export default function NavMenu() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <ul className="hidden lg:flex items-center">
      {nav.map((item) => {
        const isActive =
          item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        return (
          <li key={item.key} className="group relative">
            <Link
              href={item.href}
              className={`block px-2.5 py-2 text-sm font-medium whitespace-nowrap transition-colors xl:px-3 ${
                isActive
                  ? 'text-brand-deep'
                  : 'text-brand-ink/80 hover:text-brand-deep'
              }`}
            >
              {t(item.key)}
            </Link>
            {item.children && (
              <ul className="absolute left-0 top-full hidden min-w-[260px] border border-brand-line bg-white py-2 shadow-lg group-hover:block">
                {item.children.map((child) => (
                  <li key={child.key}>
                    <Link
                      href={child.href}
                      className="block px-4 py-2 text-sm text-brand-ink/80 hover:bg-brand-paper hover:text-brand-deep"
                    >
                      {t(child.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
