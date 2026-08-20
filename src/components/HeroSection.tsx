import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function HeroSection({
  eyebrow,
  title,
  subtitle,
  image,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  image?: string;
}) {
  const t = await getTranslations('home');
  return (
    <section className="relative isolate overflow-hidden bg-brand-midnight text-white">
      {image && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-75 animate-kenburns"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight via-brand-midnight/50 to-brand-midnight/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-midnight/80 via-brand-midnight/25 to-transparent" />
        </div>
      )}

      <div className="container-wide relative flex min-h-[72vh] flex-col justify-end pb-16 pt-28 md:min-h-[84vh] md:pb-24 md:pt-40">
        <div className="max-w-3xl animate-fadeUp">
          {eyebrow && (
            <p className="eyebrow mb-5 text-brand-lime">{eyebrow}</p>
          )}
          <h1 className="font-display text-[2.5rem] font-extrabold leading-[1.02] tracking-tight text-white sm:text-5xl md:text-[4.75rem] md:leading-[0.96]">
            {title}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 md:mt-8 md:text-lg">
            {subtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/posetite-nas/ulaznice" className="btn-primary">
              {t('ctaVisit')}
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/posetite-nas/izlozba-u-galeriji" className="btn-ghost">
              {t('ctaNews')}
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-lime" />
    </section>
  );
}
