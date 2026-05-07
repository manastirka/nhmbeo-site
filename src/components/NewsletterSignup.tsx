'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function NewsletterSignup() {
  const t = useTranslations('newsletter');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState('submitting');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      setState(res.ok ? 'ok' : 'error');
      if (res.ok) {
        setName('');
        setEmail('');
      }
    } catch {
      setState('error');
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <p className="text-sm text-white/70">{t('description')}</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('emailPlaceholder')}
          className="flex-1 border-b border-white/30 bg-transparent px-1 py-2 text-sm text-white placeholder-white/50 focus:border-brand-warm focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === 'submitting'}
          className="inline-flex items-center justify-center gap-2 bg-brand-warm px-5 py-2 text-xs font-medium uppercase tracking-widerx text-brand-midnight transition-colors hover:bg-white disabled:opacity-50"
        >
          {state === 'submitting' ? t('submitting') : t('submit')}
        </button>
      </div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('namePlaceholder')}
        className="w-full border-b border-white/15 bg-transparent px-1 py-2 text-sm text-white placeholder-white/40 focus:border-brand-warm focus:outline-none"
      />
      {state === 'ok' && (
        <p className="text-xs text-brand-warm">{t('success')}</p>
      )}
      {state === 'error' && (
        <p className="text-xs text-red-300">{t('error')}</p>
      )}
    </form>
  );
}
