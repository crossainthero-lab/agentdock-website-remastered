import { motion } from 'motion/react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { blogPosts } from '../content/blog';
import { MarkdownContent } from '../components/MarkdownContent';

type BlogPostView = {
  slug: string;
  title: string;
  date?: string;
  publishedAt?: string | null;
  description?: string;
  excerpt?: string;
  category?: string;
  content?: string;
  contentMarkdown?: string;
  contentBlocks?: Array<Record<string, unknown>>;
};

function markdownWithBlocks(post: BlogPostView) {
  const blocks = post.contentBlocks || [];
  const blockMarkdown = blocks
    .map((block) => {
      if (block.type === 'video') return `\n\n\`\`\`video\n${JSON.stringify(block, null, 2)}\n\`\`\`\n`;
      if (block.type === 'markdown' && typeof block.markdown === 'string') return block.markdown;
      return '';
    })
    .join('\n');
  return `${post.contentMarkdown || post.content || ''}${blockMarkdown}`;
}

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const staticPost = blogPosts.find((post) => post.slug === slug);
  const [post, setPost] = useState<BlogPostView | null | undefined>(staticPost);

  useEffect(() => {
    let mounted = true;
    if (!slug) return undefined;
    fetch(`/api/blog/${slug}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Post not found');
        const body = (await response.json()) as { post?: BlogPostView };
        if (mounted && body.post) setPost({ ...body.post, description: body.post.description || body.post.excerpt });
      })
      .catch(() => {
        if (mounted) setPost(staticPost || null);
      });
    return () => {
      mounted = false;
    };
  }, [slug, staticPost]);

  if (post === undefined) return null;
  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to blog
        </Link>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6 text-sm">
              <span className="text-gray-400">{new Date(post.publishedAt || post.date || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              {post.category && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray-600" />
                  <span className="text-blue-400 font-medium">{post.category}</span>
                </>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">{post.title}</h1>
            <p className="text-xl text-gray-400 leading-relaxed">{post.description || post.excerpt}</p>
          </header>

          <MarkdownContent markdown={markdownWithBlocks(post)} />
        </motion.article>
      </div>
    </div>
  );
}
