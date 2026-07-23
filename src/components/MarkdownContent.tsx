import { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface MarkdownContentProps {
  markdown: string;
  className?: string;
}

export function renderMarkdown(markdown: string): string {
  const rawHtml = marked.parse(markdown, { async: false, gfm: true, breaks: false }) as string;
  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'style', 'link', 'meta'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style'],
  });

  const template = document.createElement('template');
  template.innerHTML = cleanHtml;

  template.content.querySelectorAll('a').forEach((link) => {
    const href = link.getAttribute('href') ?? '';
    if (/^\s*javascript:/i.test(href)) {
      link.removeAttribute('href');
    }

    if (/^https?:\/\//i.test(href)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  template.content.querySelectorAll('img').forEach((image) => {
    const src = image.getAttribute('src') ?? '';
    if (/^\s*javascript:/i.test(src)) {
      image.remove();
    }
    image.setAttribute('loading', 'lazy');
  });

  return template.innerHTML;
}

export function MarkdownContent({ markdown, className = '' }: MarkdownContentProps) {
  const html = useMemo(() => renderMarkdown(markdown), [markdown]);

  return (
    <div
      className={`markdown-body max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
