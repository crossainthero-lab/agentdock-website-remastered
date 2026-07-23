import { Link, useLocation } from 'react-router-dom';
import { Github } from 'lucide-react';
import { AgentDockIcon } from './icons/AgentDockIcon';
import { motion } from 'motion/react';

export function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Downloads', path: '/downloads' },
    { name: 'AIgency', path: '/aigency' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-ad-border)] bg-[var(--color-ad-bg)]/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-5xl">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-white font-bold hover:opacity-80 transition-opacity">
            <AgentDockIcon className="w-6 h-6" />
            <span className="text-lg tracking-tight">AgentDock</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`transition-colors relative py-2 ${location.pathname === link.path ? 'text-white' : 'text-[var(--color-ad-text-muted)] hover:text-white'}`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent-purple)] rounded-t-full shadow-[0_0_8px_var(--color-accent-purple)]" 
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/crossainthero-lab/AgentDock" target="_blank" rel="noopener noreferrer" className="text-[var(--color-ad-text-muted)] hover:text-white transition-colors" aria-label="GitHub">
            <Github className="w-5 h-5" />
          </a>
          <Link to="/downloads" className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-[var(--color-accent-purple)] rounded-md hover:bg-[var(--color-accent-purple-hover)] hover:shadow-[0_0_15px_var(--color-accent-purple-glow)] hover:scale-[1.02] active:scale-95 transition-all">
            Download
          </Link>
        </div>
      </div>
    </header>
  );
}
