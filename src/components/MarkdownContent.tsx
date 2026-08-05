import Markdown from 'react-markdown';
import { Mermaid } from './Mermaid';
import { VideoPlayer } from './VideoPlayer';

type CodeProps = {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
};

function parseVideoConfig(value: string) {
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    return parsed;
  } catch {
    return null;
  }
}

export function MarkdownContent({ markdown, className = '' }: { markdown: string; className?: string }) {
  return (
    <div className={`prose prose-invert prose-blue max-w-none prose-p:text-gray-300 prose-headings:text-white prose-a:text-blue-400 ${className}`}>
      <Markdown
        components={{
          code({ inline, className, children }: CodeProps) {
            const language = /language-(\w+)/.exec(className || '')?.[1];
            const content = String(children || '').trim();
            if (!inline && language === 'mermaid') return <Mermaid chart={content} />;
            if (!inline && language === 'video') {
              const config = parseVideoConfig(content);
              if (!config) return <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">Invalid video block.</div>;
              return <VideoPlayer {...config} />;
            }
            return <code className={className}>{children}</code>;
          },
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
