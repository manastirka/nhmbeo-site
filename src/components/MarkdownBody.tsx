// Tiny markdown renderer covering only the constructs our scraped content uses:
// ## h2, ### h3, blank-line paragraphs, "- " unordered lists.
// Avoids a heavy dep when our content is this constrained.

type Block =
  | { type: 'h2' | 'h3' | 'p'; text: string }
  | { type: 'ul'; items: string[] };

function parse(md: string): Block[] {
  const blocks: Block[] = [];
  const paragraphs = md.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  for (const p of paragraphs) {
    if (p.startsWith('### ')) {
      blocks.push({ type: 'h3', text: p.slice(4).trim() });
    } else if (p.startsWith('## ')) {
      blocks.push({ type: 'h2', text: p.slice(3).trim() });
    } else if (p.split('\n').every((l) => l.startsWith('- '))) {
      blocks.push({
        type: 'ul',
        items: p.split('\n').map((l) => l.slice(2).trim()),
      });
    } else {
      blocks.push({ type: 'p', text: p.replace(/\n/g, ' ') });
    }
  }
  return blocks;
}

export default function MarkdownBody({ source }: { source: string }) {
  if (!source) return null;
  const blocks = parse(source);
  return (
    <div className="prose-museum">
      {blocks.map((b, i) => {
        if (b.type === 'h2') return <h2 key={i}>{b.text}</h2>;
        if (b.type === 'h3') return <h3 key={i}>{b.text}</h3>;
        if (b.type === 'ul')
          return (
            <ul key={i}>
              {b.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          );
        return <p key={i}>{b.text}</p>;
      })}
    </div>
  );
}
