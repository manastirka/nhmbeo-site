import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { NewsArticle } from '@/lib/news';

export default function NewsCard({
  article,
  variant = 'default',
}: {
  article: NewsArticle;
  variant?: 'default' | 'large';
}) {
  const isLarge = variant === 'large';

  return (
    <article className="group h-full">
      <Link href={`/vesti/${article.slug}`} className="block h-full no-underline">
        <div
          className={`relative overflow-hidden rounded-3xl bg-brand-bone ${
            isLarge ? 'aspect-[16/10]' : 'aspect-[4/3]'
          }`}
        >
          {article.image ? (
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes={isLarge ? '(min-width: 1024px) 800px, 100vw' : '(min-width: 1024px) 400px, 90vw'}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple to-brand-deep" />
          )}
        </div>
        <div className="mt-5">
          <p className="eyebrow mb-2">{article.date}</p>
          <h3
            className={`font-display leading-tight text-brand-deep group-hover:text-brand-purple ${
              isLarge ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
            }`}
          >
            {article.title}
          </h3>
          {isLarge && (
            <p className="mt-3 max-w-xl text-brand-ink/70 line-clamp-2">
              {article.excerpt}
            </p>
          )}
          <span
            aria-hidden="true"
            className="mt-3 inline-block text-sm font-semibold text-brand-deep transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </div>
      </Link>
    </article>
  );
}
