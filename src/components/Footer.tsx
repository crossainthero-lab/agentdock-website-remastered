import { Link } from 'react-router-dom';
import { AgentDockIcon } from './icons/AgentDockIcon';
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-ad-border)] bg-[var(--color-ad-bg)] py-12 mt-auto">
      <div className="container mx-auto px-6 max-w-5xl flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="flex flex-col gap-4 max-w-xs">
          <Link to="/" className="flex items-center gap-2 text-white font-bold hover:opacity-80 transition-opacity">
            <AgentDockIcon className="w-5 h-5" />
            <span>AgentDock</span>
          </Link>
          <p className="text-sm text-[var(--color-ad-text-muted)] leading-relaxed">
            Your coding agents. One desktop workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-16 text-sm">
          <div className="flex flex-col gap-4">
            <span className="text-white font-bold tracking-tight">Product</span>
            <Link to="/downloads" className="text-[var(--color-ad-text-muted)] hover:text-white transition-colors">Downloads</Link>
            <Link to="/aigency" className="text-[var(--color-ad-text-muted)] hover:text-white transition-colors">AIgency</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-white font-bold tracking-tight">Resources</span>
            <Link to="/blog" className="text-[var(--color-ad-text-muted)] hover:text-white transition-colors">Blog</Link>
            <a href="https://github.com/crossainthero-lab/AgentDock" target="_blank" rel="noopener noreferrer" className="text-[var(--color-ad-text-muted)] hover:text-white transition-colors flex items-center gap-2">
              GitHub <Github className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 max-w-5xl mt-12 pt-8 border-t border-[var(--color-ad-border)] text-xs text-[var(--color-ad-text-muted)] flex justify-between">
        <span>&copy; {new Date().getFullYear()} AgentDock. All rights reserved.</span>
      </div>
    </footer>
  );
}
