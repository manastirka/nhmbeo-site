import Image from 'next/image';

export default function Gallery({
  images,
  caption,
  variant = 'grid',
}: {
  images: string[];
  caption?: string;
  variant?: 'grid' | 'strip';
}) {
  if (!images || images.length === 0) return null;

  if (variant === 'strip') {
    return (
      <div className="my-10">
        {caption && (
          <p className="eyebrow mb-3 text-brand-warmDeep">{caption}</p>
        )}
        <div className="-mx-4 grid grid-cols-2 gap-2 sm:mx-0 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((src, i) => (
            <a
              key={i}
              href={src}
              target="_blank"
              rel="noreferrer noopener"
              className="group relative block aspect-[4/3] overflow-hidden bg-brand-bone"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 1024px) 280px, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="my-12">
      {caption && (
        <p className="eyebrow mb-4 text-brand-warmDeep">{caption}</p>
      )}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {images.map((src, i) => (
          <a
            key={i}
            href={src}
            target="_blank"
            rel="noreferrer noopener"
            className="group relative block aspect-square overflow-hidden bg-brand-bone"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 1024px) 280px, 45vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <span className="absolute inset-0 bg-brand-midnight/0 transition-colors duration-300 group-hover:bg-brand-midnight/15" />
          </a>
        ))}
      </div>
    </section>
  );
}
