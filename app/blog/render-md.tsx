/**
 * Minimal, safe server-side Markdown renderer — no packages, no raw HTML.
 * Content is emitted as React elements, so React escapes every text node;
 * any HTML typed into a post body renders as literal text.
 *
 * Supported: ## / ### headings, **bold**, *italic*, [text](url) links,
 * unordered "- " lists, "> " blockquotes, paragraphs split on blank lines.
 */

import type { ReactNode } from 'react';

/** Only allow safe link destinations. */
function safeHref(url: string): string | null {
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return trimmed;
  return null;
}

const INLINE_RE =
  /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Render inline markdown (**bold**, *italic*, [text](url)) into React nodes. */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const match of text.matchAll(INLINE_RE)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));
    const key = `${keyPrefix}-${i++}`;
    if (match[1] !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold text-white">
          {match[1]}
        </strong>
      );
    } else if (match[2] !== undefined) {
      nodes.push(<em key={key}>{match[2]}</em>);
    } else {
      const href = safeHref(match[4]);
      if (href) {
        const external = /^https?:\/\//i.test(href);
        nodes.push(
          <a
            key={key}
            href={href}
            className="text-cyan underline underline-offset-2 transition-colors hover:text-white"
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {match[3]}
          </a>
        );
      } else {
        nodes.push(match[3]);
      }
    }
    last = index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

type Block =
  | { type: 'h2' | 'h3' | 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'quote'; lines: string[] };

function parseBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: 'p', text: paragraph.join(' ') });
      paragraph = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      continue;
    }
    if (trimmed.startsWith('### ')) {
      flushParagraph();
      blocks.push({ type: 'h3', text: trimmed.slice(4) });
      continue;
    }
    if (trimmed.startsWith('## ')) {
      flushParagraph();
      blocks.push({ type: 'h2', text: trimmed.slice(3) });
      continue;
    }
    if (trimmed.startsWith('- ')) {
      flushParagraph();
      const prev = blocks[blocks.length - 1];
      if (prev?.type === 'ul') prev.items.push(trimmed.slice(2));
      else blocks.push({ type: 'ul', items: [trimmed.slice(2)] });
      continue;
    }
    if (trimmed.startsWith('> ') || trimmed === '>') {
      flushParagraph();
      const content = trimmed === '>' ? '' : trimmed.slice(2);
      const prev = blocks[blocks.length - 1];
      if (prev?.type === 'quote') prev.lines.push(content);
      else blocks.push({ type: 'quote', lines: [content] });
      continue;
    }
    paragraph.push(trimmed);
  }
  flushParagraph();
  return blocks;
}

/** Render a markdown string as styled React elements. */
export function renderMarkdown(md: string): ReactNode {
  const blocks = parseBlocks(md);

  return blocks.map((block, i) => {
    switch (block.type) {
      case 'h2':
        return (
          <h2
            key={i}
            className="mb-4 mt-10 font-display text-2xl italic font-semibold text-white first:mt-0"
          >
            {renderInline(block.text, `h2-${i}`)}
          </h2>
        );
      case 'h3':
        return (
          <h3
            key={i}
            className="mb-3 mt-8 font-mono text-xs font-bold uppercase tracking-[0.25em] text-cyan first:mt-0"
          >
            {renderInline(block.text, `h3-${i}`)}
          </h3>
        );
      case 'ul':
        return (
          <ul key={i} className="mb-5 space-y-2 text-sm leading-relaxed text-white/60">
            {block.items.map((item, j) => (
              <li key={j} className="flex gap-3">
                <span aria-hidden className="mt-[0.55em] h-1.5 w-1.5 shrink-0 bg-cyan" />
                <span>{renderInline(item, `li-${i}-${j}`)}</span>
              </li>
            ))}
          </ul>
        );
      case 'quote':
        return (
          <blockquote
            key={i}
            className="mb-5 border-l-2 border-cyan/60 pl-4 text-sm italic leading-relaxed text-white/70"
          >
            {block.lines.map((line, j) => (
              <p key={j} className={j > 0 ? 'mt-2' : undefined}>
                {renderInline(line, `q-${i}-${j}`)}
              </p>
            ))}
          </blockquote>
        );
      default:
        return (
          <p key={i} className="mb-5 text-sm leading-relaxed text-white/60">
            {renderInline(block.text, `p-${i}`)}
          </p>
        );
    }
  });
}
