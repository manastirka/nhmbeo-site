import { marked } from 'marked';

// Configure once at module load.
marked.setOptions({
  gfm: true,        // GitHub-flavoured: tables, strikethrough, autolinks
  breaks: false,    // keep "single newlines = same paragraph"
});

/**
 * Renders a Markdown string. Editors write source like `**bold**`,
 * `*italic*`, `***bold italic***`, `## Heading`, lists, links, etc.
 * The output HTML is styled by the `.prose-museum` rules in globals.css.
 */
export default function MarkdownBody({ source }: { source: string }) {
  if (!source) return null;
  const html = marked.parse(source.trim(), { async: false }) as string;
  return (
    <div
      className="prose-museum"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
