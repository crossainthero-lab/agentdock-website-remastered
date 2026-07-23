import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Github, ArrowRight } from 'lucide-react';
import { AgentDockIcon } from './icons/AgentDockIcon';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('overview');

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Downloads', path: '/downloads' },
    { name: 'AIgency', path: '/aigency' },
    { name: 'Blog', path: '/blog' },
  ];

  const isAigency = location.pathname.startsWith('/aigency');
  const isTechnical = location.pathname === '/aigency/technical';

  useEffect(() => {
    if (!isAigency || isTechnical) return;

    const handleScroll = () => {
      const sections = ['overview', 'how-it-works', 'comparison'];
      const scrollPosition = window.scrollY + 150; // offset for headers

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          return;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initialize
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAigency, isTechnical, location.pathname]);

  // When changing routes, make sure hash links work by preventing default if on same page
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (location.pathname === '/aigency') {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        window.scrollTo({
          top: el.offsetTop - 120, // 64 (nav) + 48 (subnav) + padding
          behavior: 'smooth'
        });
        window.history.pushState(null, '', `/aigency#${id}`);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col bg-[var(--color-ad-bg)]/80 backdrop-blur-md">
      {/* Primary Navigation */}
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
            <Link to="/downloads" className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-[var(--color-accent-purple)] rounded-md hover:bg-[var(--color-accent-purple-hover)] hover:shadow-[0_0_15px_var(--color-accent-purple-glow)] hover:scale-[1.02] active:scale-95 transition-all">
              Download
            </Link>
          </div>
        </div>
      </div>

      {/* AIgency Secondary Navigation */}
      {isAigency && (
        <div className="border-b border-[var(--color-ad-border)] bg-[var(--color-ad-surface)]/60 backdrop-blur-sm w-full h-12 flex items-center overflow-x-auto scrollbar-hide">
          <div className="container mx-auto px-6 max-w-5xl flex gap-6 items-center text-sm font-medium whitespace-nowrap">
            <Link 
              to="/aigency#overview" 
              onClick={(e) => handleNavClick(e, 'overview')}
              className={`transition-colors relative py-3 ${!isTechnical && activeSection === 'overview' ? 'text-white' : 'text-[var(--color-ad-text-muted)] hover:text-white'}`}
            >
              Overview
              {!isTechnical && activeSection === 'overview' && (
                <motion.div layoutId="subnav-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent-purple)] rounded-t-full" />
              )}
            </Link>
            
            <Link 
              to="/aigency#how-it-works" 
              onClick={(e) => handleNavClick(e, 'how-it-works')}
              className={`transition-colors relative py-3 ${!isTechnical && activeSection === 'how-it-works' ? 'text-white' : 'text-[var(--color-ad-text-muted)] hover:text-white'}`}
            >
              How it works
              {!isTechnical && activeSection === 'how-it-works' && (
                <motion.div layoutId="subnav-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent-purple)] rounded-t-full" />
              )}
            </Link>
            
            <Link 
              to="/aigency#comparison" 
              onClick={(e) => handleNavClick(e, 'comparison')}
              className={`transition-colors relative py-3 ${!isTechnical && activeSection === 'comparison' ? 'text-white' : 'text-[var(--color-ad-text-muted)] hover:text-white'}`}
            >
              AgentDock vs AIgency
              {!isTechnical && activeSection === 'comparison' && (
                <motion.div layoutId="subnav-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent-purple)] rounded-t-full" />
              )}
            </Link>
            
            <Link 
              to="/aigency/technical" 
              className={`flex items-center gap-1 transition-colors relative py-3 ${isTechnical ? 'text-[var(--color-accent-blue)]' : 'text-[var(--color-ad-text-muted)] hover:text-[var(--color-accent-blue)]'}`}
            >
              Technical Architecture <ArrowRight className="w-3 h-3" />
              {isTechnical && (
                <motion.div layoutId="subnav-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent-blue)] rounded-t-full shadow-[0_0_8px_var(--color-accent-blue-soft)]" />
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
