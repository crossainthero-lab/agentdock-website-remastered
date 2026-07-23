import { Link } from 'react-router-dom';
import { blogPosts } from '../content/blog';
import { Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export function Blog() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto px-6 pt-24 pb-32 max-w-4xl min-h-[60vh]"
    >
      <h1 className="text-4xl font-bold text-white mb-4">Blog</h1>
      <p className="text-[var(--color-ad-text-muted)] mb-16 text-lg">
        News, updates, and thoughts on AI coding agents.
      </p>

      {blogPosts.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-[var(--color-ad-border)] rounded-xl bg-[var(--color-ad-surface)]">
          <p className="text-xl text-white font-medium mb-2">No posts yet.</p>
          <p className="text-sm text-[var(--color-ad-text-muted)] max-w-md mx-auto">
            AgentDock updates and development posts will appear here later. Check back soon for news on our progress.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {blogPosts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link 
                to={`/blog/${post.slug}`}
                className="group block p-6 border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] rounded-lg hover:bg-[var(--color-ad-surface-hover)] hover:border-[var(--color-ad-text-muted)] hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[var(--color-ad-border)] text-white group-hover:bg-[var(--color-ad-text-muted)] group-hover:text-black transition-colors">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-[var(--color-ad-text-muted)]">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--color-accent-purple-hover)] transition-colors">
                  {post.title}
                </h2>
                <p className="text-[var(--color-ad-text-muted)]">
                  {post.description}
                </p>
                <div className="mt-6 flex items-center text-sm font-medium text-[var(--color-ad-text-muted)] group-hover:text-[var(--color-accent-purple-hover)] transition-colors">
                  Read article <span className="ml-1 transition-transform group-hover:translate-x-1">&rarr;</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
