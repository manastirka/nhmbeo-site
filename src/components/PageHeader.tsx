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
        {/* Soft top dimming so the (white) header doesn't fight the image. */}
        <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-brand-midnight/30 to-transparent" />
        {/* Strong, readable scrim under the title. */}
        <div className="absolute inset-x-0 bottom-0 -z-10 h-3/5 bg-gradient-to-t from-brand-midnight via-brand-midnight/85 to-transparent" />
        <div className="container-wide flex min-h-[44vh] flex-col justify-end py-20 md:min-h-[52vh] md:py-28">
          {eyebrow && (
            <p className="eyebrow mb-4 text-brand-warm">
              {eyebrow}
            </p>
          )}
          <h1 className="max-w-3xl font-serif text-4xl leading-[1.05] md:text-6xl text-white">
            {title}
          </h1>
          {intro && (
            <p className="mt-6 max-w-2xl text-base text-white/90 md:text-lg">
              {intro}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate border-b border-brand-line bg-brand-paper">
      <div
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 0% 0%, rgba(212,164,74,0.18) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(46,110,168,0.12) 0%, transparent 50%)',
        }}
      />
      <div className="container-wide py-20 md:py-28">
        {eyebrow && (
          <p className="eyebrow mb-4 text-brand-warmDeep">{eyebrow}</p>
        )}
        <h1 className="font-serif text-4xl leading-tight text-brand-deep md:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-6 max-w-2xl text-base text-brand-ink/75 md:text-lg">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
