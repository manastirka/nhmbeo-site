import type { GlasnikVolume } from '@/lib/glasnik';

export default function GlasnikVolumeList({
  volumes,
  groupLabel,
}: {
  volumes: GlasnikVolume[];
  groupLabel: string;
}) {
  // Group by era while preserving original order.
  const groups = new Map<string, GlasnikVolume[]>();
  for (const v of volumes) {
    if (!groups.has(v.era)) groups.set(v.era, []);
    groups.get(v.era)!.push(v);
  }

  return (
    <div className="mt-10 space-y-12">
      {[...groups.entries()].map(([era, list]) => (
        <section key={era}>
          <p className="eyebrow mb-4 text-brand-warmDeep">
            {groupLabel} · {era}
          </p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((v, i) => (
              <li key={i}>
                <a
                  href={v.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-baseline justify-between gap-2 border-b border-brand-line py-2 no-underline hover:border-brand-warm"
                >
                  <span className="font-serif text-base text-brand-deep group-hover:text-brand-accent">
                    {v.label}
                  </span>
                  <span className="text-xs uppercase tracking-widerx text-brand-warmDeep">
                    PDF
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
