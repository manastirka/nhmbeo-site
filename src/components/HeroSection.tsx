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
    <section className="relative isolate overflow-hidden bg-brand-deep text-white">
      {image && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80 animate-kenburns"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/55 to-brand-deep/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-deep/85 via-brand-deep/30 to-transparent" />
        </div>
      )}

      <div className="container-wide relative flex min-h-[78vh] flex-col justify-end pb-20 pt-32 md:min-h-[88vh] md:pb-28 md:pt-44">
        <div className="max-w-3xl animate-fadeUp">
          {eyebrow && (
            <p className="eyebrow mb-6 text-brand-lime">{eyebrow}</p>
          )}
          <h1 className="font-display text-[2.6rem] leading-[1.02] sm:text-5xl md:text-[80px] md:leading-[0.98] text-white">
            {title}
          </h1>
          <p className="mt-8 max-w-xl text-base text-white/85 md:text-lg">
            {subtitle}
          </p>
          <div className="mt-12 flex flex-wrap gap-3">
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

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-lime" />
    </section>
  );
}
