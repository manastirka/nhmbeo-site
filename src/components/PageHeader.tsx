import Image from 'next/image';

export default function PageHeader({
  eyebrow,
  title,
  intro,
  image,
  imagePosition = 'center',
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  image?: string;
  imagePosition?: 'top' | 'center' | 'bottom';
}) {
  const objectPositionClass =
    imagePosition === 'top'
      ? 'object-top'
      : imagePosition === 'bottom'
        ? 'object-bottom'
        : 'object-center';
  if (image) {
    return (
      <section className="relative isolate overflow-hidden bg-brand-midnight text-white">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`absolute inset-0 -z-10 object-cover ${objectPositionClass}`}
        />
        <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-brand-midnight/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-3/5 bg-gradient-to-t from-brand-midnight via-brand-midnight/80 to-transparent" />
        <div className="container-wide flex min-h-[40vh] flex-col justify-end py-16 md:min-h-[48vh] md:py-24">
          {eyebrow && (
            <p className="eyebrow mb-3 text-brand-lime">{eyebrow}</p>
          )}
          <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              {intro}
            </p>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-lime" />
      </section>
    );
  }

  return (
    <section className="border-b border-brand-line bg-brand-paper">
      <div className="container-wide py-16 md:py-24">
        {eyebrow && (
          <p className="eyebrow mb-3">{eyebrow}</p>
        )}
        <h1 className="max-w-4xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-brand-deep md:text-6xl">
          {title}
        </h1>
        <span className="mt-6 block h-[3px] w-14 bg-brand-lime" />
        {intro && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-ink/75 md:text-lg">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
