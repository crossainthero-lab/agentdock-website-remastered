import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import { MarkdownContent } from '../components/MarkdownContent';
import type { ApiResponse, BlogPost as BlogPostType } from '../types/cms';

export function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found' | 'error'>('loading');

  useEffect(() => {
    let isMounted = true;

    fetch(`/api/blog/${encodeURIComponent(slug ?? '')}`)
      .then(async (response) => {
        const body = await response.json() as ApiResponse<BlogPostType>;
        if (response.status === 404) {
          if (isMounted) {
            setStatus('not-found');
          }
          return;
        }

        if (!response.ok || !body.ok) {
          throw new Error('error' in body ? body.error : 'Post could not be loaded.');
        }

        if (isMounted) {
          setPost(body.data);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (isMounted) {
          setStatus('error');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-3xl">
        <p className="text-[var(--color-ad-text-muted)]">Loading article...</p>
      </div>
    );
  }

  if (status === 'not-found' || !post) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-[var(--color-ad-text-muted)] hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to blog
        </Link>
        <h1 className="text-4xl font-bold text-white mb-4">Post not found</h1>
        <p className="text-[var(--color-ad-text-muted)]">That post does not exist or has not been published.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-[var(--color-ad-text-muted)] hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to blog
        </Link>
        <h1 className="text-4xl font-bold text-white mb-4">Article could not be loaded</h1>
        <p className="text-[var(--color-ad-text-muted)]">Refresh the page to try again.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-3xl">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-[var(--color-ad-text-muted)] hover:text-white transition-colors mb-12">
        <ArrowLeft className="w-4 h-4" /> Back to blog
      </Link>
      
      <article>
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[var(--color-ad-border)] text-white">
              {post.category || 'Update'}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[var(--color-ad-text-muted)]">
              <Calendar className="w-3.5 h-3.5" />
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unscheduled'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-[var(--color-ad-text-muted)] leading-relaxed">
            {post.description}
          </p>
          {post.coverImage && (
            <img src={post.coverImage} alt="" className="mt-10 w-full rounded-xl border border-[var(--color-ad-border)] object-cover max-h-[28rem]" />
          )}
        </header>

        <MarkdownContent markdown={post.contentMarkdown} className="text-lg" />
      </article>
    </div>
  );
}
