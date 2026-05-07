import { Link } from '@/i18n/navigation';

type Item = { title: string; description: string; href: string };

const TILE_BG = ['bg-brand-peach', 'bg-brand-lime', 'bg-brand-cyan', 'bg-brand-purple'];
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
      <div className="container-wide py-20 md:py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="eyebrow mb-3">01 — Plan</p>
            <h2 className="font-display text-4xl text-brand-deep md:text-5xl">{title}</h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className={`group relative flex min-h-[260px] flex-col justify-between rounded-3xl p-7 transition-all hover:-translate-y-1 hover:shadow-xl no-underline ${TILE_BG[i % TILE_BG.length]} ${TILE_TEXT[i % TILE_TEXT.length]}`}
            >
              <span className="text-xs font-semibold uppercase tracking-widerx opacity-70">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-display text-2xl leading-tight md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm opacity-80">{item.description}</p>
                <span
                  aria-hidden="true"
                  className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-current/10 transition-transform group-hover:translate-x-1"
                >
                  <span className={`text-xl ${i === 3 ? 'text-white' : 'text-brand-midnight'}`}>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
