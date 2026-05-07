import Image from 'next/image';
import { Link } from '@/i18n/navigation';

export default function ExhibitionShowcase({
  eyebrow,
  title,
  description,
  href,
  image,
  cta,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  href: string;
  image?: string;
  cta?: string;
}) {
  return (
    <section className="bg-brand-deep text-white">
      <div className="container-wide grid gap-0 md:grid-cols-12 md:gap-12 py-20">
        <div className="relative col-span-7 aspect-[4/3] overflow-hidden rounded-3xl md:aspect-auto md:min-h-[560px]">
          {image && (
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
            />
          )}
        </div>
        <div className="col-span-5 mt-8 flex flex-col justify-center md:mt-0">
          {eyebrow && (
            <p className="eyebrow mb-4 text-brand-lime">{eyebrow}</p>
          )}
          <h2 className="font-display text-4xl leading-[1.05] text-white md:text-6xl">
            {title}
          </h2>
          <p className="mt-6 max-w-md text-white/80 md:text-lg">{description}</p>
          <Link
            href={href}
            className="btn-primary mt-10 self-start"
          >
            {cta || 'Read more'}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
