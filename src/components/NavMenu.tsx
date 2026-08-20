'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { nav } from '@/lib/nav';

export default function NavMenu() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <ul className="hidden items-center lg:flex">
      {nav.map((item) => {
        const isActive =
          item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        return (
          <li key={item.key} className="group relative">
            <Link
              href={item.href}
              className={`relative block px-2.5 py-2 text-[13px] font-medium whitespace-nowrap transition-colors xl:px-3 ${
                isActive
                  ? 'text-brand-deep'
                  : 'text-brand-ink/70 hover:text-brand-deep'
              }`}
            >
              {t(item.key)}
              <span
                aria-hidden="true"
                className={`absolute inset-x-2.5 -bottom-0.5 h-[2px] bg-brand-lime transition-opacity ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
                }`}
              />
            </Link>
            {item.children && (
              <ul className="invisible absolute left-0 top-full z-50 min-w-[240px] border border-brand-line bg-white py-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                {item.children.map((child) => (
                  <li key={child.key}>
                    <Link
                      href={child.href}
                      className="block px-4 py-2 text-sm text-brand-ink/75 hover:bg-brand-paper hover:text-brand-deep"
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
