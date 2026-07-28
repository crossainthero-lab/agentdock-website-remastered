import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mermaid } from '../components/Mermaid';
import { MarkdownContent } from '../components/MarkdownContent';
import { bundledTechnicalSectionsWithIds, technicalArchitectureIntro } from '../content/technicalArchitecture';
import type { ApiResponse, TechnicalSection } from '../types/cms';

export function AIgencyTechnical() {
  const [activeSection, setActiveSection] = useState('overview');
  const [sections, setSections] = useState<TechnicalSection[]>(() => bundledTechnicalSectionsWithIds());
  const [contentStatus, setContentStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    const pageSections = document.querySelectorAll('section[id]');
    pageSections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    let isMounted = true;

    fetch('/api/technical-architecture')
      .then(async (response) => {
        const body = await response.json() as ApiResponse<TechnicalSection[]>;
        if (!response.ok || !body.ok) {
          throw new Error('error' in body ? body.error : 'Technical content could not be loaded.');
        }
        if (isMounted) {
          if (body.data.length > 0) {
            setSections(body.data);
            setContentStatus('ready');
          } else {
            setContentStatus('fallback');
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setContentStatus('fallback');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const navItems = sections.map((section) => ({ id: section.sectionKey, label: section.title }));

  return (
    <div className="flex flex-col relative pb-32 pt-8">
      
      {/* Page Header */}
      <div className="container mx-auto px-6 max-w-7xl mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{technicalArchitectureIntro.title}</h1>
        <p className="text-[var(--color-ad-text-muted)] text-lg max-w-3xl">{technicalArchitectureIntro.description}</p>
        {contentStatus === 'loading' && (
          <p className="mt-4 text-xs text-[var(--color-ad-text-muted)]">Loading latest technical content...</p>
        )}
        {contentStatus === 'fallback' && (
          <div className="mt-6 max-w-3xl rounded-md border border-[var(--color-accent-amber-border)] bg-[var(--color-accent-amber-soft)] px-4 py-3 text-sm text-[var(--color-accent-amber)]">
            Live technical content could not be loaded, so the bundled fallback is shown.
          </div>
        )}
      </div>

      <div className="container mx-auto px-6 max-w-7xl flex flex-col lg:flex-row gap-12 relative items-start">
        
        {/* Sticky Sidebar Nav (Desktop) / Scrollable Header (Mobile) */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky top-[80px] z-30 lg:z-0 bg-[var(--color-ad-bg)]/90 backdrop-blur-md lg:bg-transparent pb-4 lg:pb-0 border-b border-[var(--color-ad-border)] lg:border-none">
          <nav className="flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-visible scrollbar-hide py-2 lg:py-0">
            {navItems.map((item) => (
              <a 
                key={item.id} 
                href={`#${item.id}`}
                className={`whitespace-nowrap px-3 lg:px-4 py-2 text-sm rounded-md transition-colors ${
                  activeSection === item.id 
                    ? 'bg-[var(--color-accent-blue-soft)] text-[var(--color-accent-blue)] font-medium border border-[var(--color-accent-blue-border)] lg:border-transparent' 
                    : 'text-[var(--color-ad-text-muted)] hover:text-white hover:bg-[var(--color-ad-surface)]'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 flex flex-col gap-24">
          {sections.map((section) => (
            <section key={section.sectionKey} id={section.sectionKey} className="scroll-mt-[150px]">
              <h2 className="text-2xl font-bold text-white mb-6">{section.title}</h2>
              <MarkdownContent markdown={section.contentMarkdown} className={section.mermaidSource ? 'mb-8' : ''} />
              {section.mermaidSource && (
                <div className="w-full xl:-mx-8">
                  <Mermaid chart={section.mermaidSource} />
                </div>
              )}
            </section>
          ))}

        </main>
      </div>
    </div>
  );
}
