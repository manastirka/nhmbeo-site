'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { nav } from '@/lib/nav';

export default function MobileMenu() {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // Close drawer on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while open + close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const drawer =
    mounted && open
      ? createPortal(
          <div
            className="fixed inset-0 z-[100] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={t('open')}
          >
            <button
              type="button"
              aria-label={t('close')}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-brand-midnight/60 backdrop-blur-sm"
            />
            <div className="absolute inset-y-0 right-0 flex w-[88vw] max-w-sm flex-col overflow-y-auto bg-white animate-[slideInRight_220ms_ease-out]">
              <div className="flex items-center justify-end p-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t('close')}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full text-brand-ink hover:bg-brand-paper active:bg-brand-line"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <nav className="flex-1 px-6 pb-10">
                <ul>
                  {nav.map((item) => (
                    <li key={item.key} className="border-b border-brand-line/60 py-2">
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block py-3 font-display text-xl font-semibold text-brand-deep no-underline"
                      >
                        {t(item.key)}
                      </Link>
                      {item.children && (
                        <ul className="mb-2 space-y-1 pl-1 pb-2">
                          {item.children.map((child) => (
                            <li key={child.key}>
                              <Link
                                href={child.href}
                                onClick={() => setOpen(false)}
                                className="block py-1.5 text-sm text-brand-ink/75 no-underline"
                              >
                                {t(child.key)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/posetite-nas/ulaznice"
                  onClick={() => setOpen(false)}
                  className="mt-8 inline-flex w-full items-center justify-between rounded-full bg-brand-lime px-5 py-3 text-sm font-semibold uppercase tracking-widerx text-brand-midnight no-underline"
                >
                  <span>{t('tickets_short')}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </nav>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('open')}
        aria-expanded={open}
        className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full text-brand-ink active:bg-brand-line"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      {drawer}
    </>
  );
}
