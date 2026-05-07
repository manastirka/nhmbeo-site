import type { DocumentItem } from '@/lib/content';
import { getTranslations } from 'next-intl/server';

export default async function DocumentList({
  documents,
}: {
  documents: DocumentItem[];
}) {
  const t = await getTranslations('documents');

  if (documents.length === 0) {
    return <p className="text-brand-ink/60">{t('empty')}</p>;
  }

  return (
    <ul className="divide-y divide-brand-line border-t border-b border-brand-line">
      {documents.map((doc, i) => (
        <li key={i} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <a
              href={doc.href}
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium text-brand-deep hover:text-brand-accent"
            >
              {doc.title}
            </a>
            {doc.date && (
              <p className="text-xs text-brand-ink/60">{doc.date}</p>
            )}
          </div>
          <span className="text-xs uppercase text-brand-ink/50">
            {doc.size ? `PDF · ${doc.size}` : 'PDF'}
          </span>
        </li>
      ))}
    </ul>
  );
}
