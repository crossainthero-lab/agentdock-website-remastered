import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { blogPosts } from '../content/blog';

type BlogSummary = {
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  date?: string;
  publishedAt?: string | null;
  category?: string;
};

export function Blog() {
  const [posts, setPosts] = useState<BlogSummary[]>(blogPosts);

  useEffect(() => {
    let mounted = true;
    fetch('/api/blog')
      .then(async (response) => {
        if (!response.ok) throw new Error('Blog API unavailable');
        const body = (await response.json()) as { posts?: BlogSummary[] };
        if (mounted && body.posts?.length) {
          setPosts(body.posts.map((post) => ({ ...post, description: post.description || post.excerpt })));
        }
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
            Blog
          </motion.h1>
          <p className="text-gray-400 text-lg">Thoughts, updates, and news from the AgentDock team.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post, i) => (
            <motion.div key={post.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link to={`/blog/${post.slug}`} className="block h-full glass-panel p-8 rounded-2xl border hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-3 mb-4 text-sm">
                  <span className="text-gray-400">{new Date(post.publishedAt || post.date || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  {post.category && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                      <span className="text-blue-400 font-medium">{post.category}</span>
                    </>
                  )}
                </div>
                <h2 className="text-2xl font-semibold text-white mb-3">{post.title}</h2>
                <p className="text-gray-400 mb-6 line-clamp-3">{post.description || post.excerpt}</p>
                <div className="text-white font-medium flex items-center gap-2 text-sm group">
                  Read article <span className="transition-transform group-hover:translate-x-1">-&gt;</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
