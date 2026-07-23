import { useParams, Navigate, Link } from 'react-router-dom';
import { blogPosts } from '../content/blog';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Calendar, ArrowLeft } from 'lucide-react';

export function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const htmlContent = DOMPurify.sanitize(marked.parse(post.content) as string);

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-3xl">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-[var(--color-ad-text-muted)] hover:text-white transition-colors mb-12">
        <ArrowLeft className="w-4 h-4" /> Back to blog
      </Link>
      
      <article>
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[var(--color-ad-border)] text-white">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[var(--color-ad-text-muted)]">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-[var(--color-ad-text-muted)] leading-relaxed">
            {post.description}
          </p>
        </header>

        <div 
          className="markdown-body text-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </div>
  );
}
