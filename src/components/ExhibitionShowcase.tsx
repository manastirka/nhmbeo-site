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
    <section className="bg-brand-midnight text-white">
      <div className="container-wide grid items-center gap-10 py-16 md:grid-cols-12 md:gap-14 md:py-24">
        <div className="relative col-span-7 aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[520px]">
          {image && (
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
            />
          )}
          <span className="absolute left-0 top-0 h-full w-[3px] bg-brand-lime" />
        </div>
        <div className="col-span-5 flex flex-col justify-center">
          {eyebrow && (
            <p className="eyebrow mb-4 text-brand-lime">{eyebrow}</p>
          )}
          <h2 className="font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-white md:text-5xl">
            {title}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/75 md:text-lg">
            {description}
          </p>
          <Link href={href} className="btn-primary mt-8 self-start">
            {cta || 'Read more'}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
