import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Github } from 'lucide-react';
import { AgentDockIcon } from './icons/AgentDockIcon';
import { motion } from 'motion/react';
import { AnnouncementBar, isVisibleAnnouncement } from './AnnouncementBar';
import type { ApiResponse, SiteAnnouncement } from '../types/cms';

export function Navbar() {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState<SiteAnnouncement | null>(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'AgentDock Pro', path: '/pro' },
    { name: 'Downloads', path: '/downloads' },
    { name: 'Blog', path: '/blog' },
  ];

  useEffect(() => {
    let isMounted = true;

    fetch('/api/announcement')
      .then(async (response) => {
        const body = await response.json() as ApiResponse<SiteAnnouncement>;
        if (!response.ok || !body.ok) {
          throw new Error('error' in body ? body.error : 'Announcement could not be loaded.');
        }
        if (isMounted) {
          setAnnouncement(body.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAnnouncement(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col bg-[var(--color-ad-bg)]/80 backdrop-blur-md">
      <AnnouncementBar announcement={announcement} />

      <div className="border-b border-[var(--color-ad-border)] w-full">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-white font-bold hover:opacity-80 transition-opacity">
              <AgentDockIcon className="w-6 h-6" />
              <span className="text-lg tracking-tight">AgentDock</span>
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              {navLinks.map((link) => {
                const isActive = link.path === '/' 
                  ? location.pathname === '/' 
                  : location.pathname.startsWith(link.path);

                return (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    className={`transition-colors relative py-2 ${isActive ? 'text-white' : 'text-[var(--color-ad-text-muted)] hover:text-white'}`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div 
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent-purple)] rounded-t-full shadow-[0_0_8px_var(--color-accent-purple)]" 
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/crossainthero-lab/AgentDock" target="_blank" rel="noopener noreferrer" className="text-[var(--color-ad-text-muted)] hover:text-white transition-colors" aria-label="GitHub">
              <Github className="w-5 h-5" />
            </a>
            <Link to="/waitlist" className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-md hover:bg-[var(--color-ad-surface-hover)] transition-all">
              Join Waitlist
            </Link>
            <Link to="/downloads" className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-[var(--color-accent-purple)] rounded-md hover:bg-[var(--color-accent-purple-hover)] hover:shadow-[0_0_15px_var(--color-accent-purple-glow)] hover:scale-[1.02] active:scale-95 transition-all">
              Download
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
