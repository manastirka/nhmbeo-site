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
          className={`relative overflow-hidden bg-brand-bone ${
            isLarge ? 'aspect-[16/10]' : 'aspect-[4/3]'
          }`}
        >
          {article.image ? (
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes={isLarge ? '(min-width: 1024px) 800px, 100vw' : '(min-width: 1024px) 400px, 90vw'}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 bg-brand-deep" />
          )}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-midnight/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div className="mt-4">
          <p className="eyebrow mb-2">{article.date}</p>
          <h3
            className={`font-display font-bold leading-tight tracking-tight text-brand-deep group-hover:text-brand-purple ${
              isLarge ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
            }`}
          >
            {article.title}
          </h3>
          {isLarge && (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-ink/70 line-clamp-2 md:text-base">
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
