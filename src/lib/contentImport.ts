export type MarkdownImport = {
  markdown: string;
  title?: string;
  slug?: string;
  description?: string;
  category?: string;
  coverImage?: string;
  mermaidSource?: string;
};

type MarkdownImportOptions = {
  extractMermaid?: boolean;
};

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const MERMAID_FENCE_PATTERN = /```(?:mermaid|mmd)\s*\r?\n([\s\S]*?)```/i;

export function parseMarkdownImport(
  source: string,
  filename = '',
  options: MarkdownImportOptions = {},
): MarkdownImport {
  const frontmatterMatch = source.match(FRONTMATTER_PATTERN);
  const frontmatter = frontmatterMatch ? parseFrontmatter(frontmatterMatch[1]) : {};
  let markdown = frontmatterMatch ? source.slice(frontmatterMatch[0].length) : source;
  let mermaidSource: string | undefined;

  if (options.extractMermaid) {
    const mermaidMatch = markdown.match(MERMAID_FENCE_PATTERN);
    if (mermaidMatch) {
      mermaidSource = mermaidMatch[1].trim();
      markdown = markdown.replace(mermaidMatch[0], '').trim();
    }
  }

  const title = frontmatter.title ?? firstMarkdownHeading(markdown) ?? filenameTitle(filename);
  const slug = frontmatter.slug ?? (title ? slugify(title) : undefined);

  return {
    markdown: markdown.trim(),
    title,
    slug,
    description: frontmatter.description,
    category: frontmatter.category,
    coverImage: frontmatter.coverImage ?? frontmatter.cover_image,
    mermaidSource,
  };
}

export function filenameTitle(filename: string): string | undefined {
  const withoutExtension = filename.replace(/\.[^.]+$/, '').trim();
  if (!withoutExtension) {
    return undefined;
  }

  return withoutExtension
    .replace(/[-_]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function firstMarkdownHeading(markdown: string): string | undefined {
  const heading = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return heading || undefined;
}

function parseFrontmatter(source: string): Record<string, string> {
  return source.split(/\r?\n/).reduce<Record<string, string>>((values, line) => {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*(.*)$/);
    if (!match) {
      return values;
    }

    const key = match[1].trim();
    const value = match[2].trim().replace(/^['"]|['"]$/g, '');
    values[key] = value;
    return values;
  }, {});
}
