import { Link } from '@/i18n/navigation';

type Item = { title: string; description: string; href: string };

const TILE_BG = ['bg-brand-peach', 'bg-brand-lime', 'bg-brand-cyan', 'bg-brand-deep'];
const TILE_TEXT = ['text-brand-midnight', 'text-brand-midnight', 'text-brand-midnight', 'text-white'];

export default function PlanYourVisitTiles({
  title,
  items,
}: {
  title: string;
  items: Item[];
}) {
  return (
    <section className="bg-brand-paper">
      <div className="container-wide py-16 md:py-24">
        <div className="mb-10">
          <p className="eyebrow mb-3">01 — Plan</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-brand-deep md:text-5xl">
            {title}
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className={`group relative flex min-h-[240px] flex-col justify-between rounded-2xl p-6 no-underline transition-transform hover:-translate-y-0.5 md:p-7 ${TILE_BG[i % TILE_BG.length]} ${TILE_TEXT[i % TILE_TEXT.length]}`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-widerx opacity-60">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-display text-2xl font-bold leading-tight tracking-tight md:text-[1.7rem]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed opacity-80">{item.description}</p>
                <span
                  aria-hidden="true"
                  className="mt-5 inline-flex text-lg transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
