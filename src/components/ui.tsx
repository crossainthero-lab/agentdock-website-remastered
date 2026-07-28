import React from 'react';
import { motion } from 'motion/react';

export function SectionHeading({ title, subtitle, className = '' }: { title: string; subtitle?: string; className?: string }) {
  return (
    <div className={`mb-12 ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">{title}</h2>
      {subtitle && <p className="text-lg text-[var(--color-ad-text-muted)] max-w-2xl">{subtitle}</p>}
    </div>
  );
}

export function FeatureCard({ icon, title, description, badge, delay = 0 }: { icon: React.ReactNode; title: string; description: string; badge?: string; delay?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="p-6 rounded-xl border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] hover:bg-[var(--color-ad-surface-hover)] hover:border-[var(--color-accent-purple-border)] transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-lg bg-[var(--color-ad-bg)] border border-[var(--color-ad-border)] flex items-center justify-center text-[var(--color-accent-purple)] group-hover:text-white group-hover:bg-[var(--color-accent-purple)] transition-colors">
          {icon}
        </div>
        {badge && <StatusBadge status={badge as any} />}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-[var(--color-ad-text-muted)] leading-relaxed">{description}</p>
    </motion.div>
  );
}

export function StatusBadge({ status }: { status: 'Available now' | 'In development' | 'Planned' | 'Stable' | 'Preview' }) {
  const styles = {
    'Available now': 'bg-[var(--color-accent-green-soft)] text-[var(--color-accent-green)] border-[var(--color-accent-green-border)]',
    'Stable': 'bg-[var(--color-accent-green-soft)] text-[var(--color-accent-green)] border-[var(--color-accent-green-border)]',
    'In development': 'bg-[var(--color-accent-blue-soft)] text-[var(--color-accent-blue)] border-[var(--color-accent-blue-border)]',
    'Preview': 'bg-[var(--color-accent-blue-soft)] text-[var(--color-accent-blue)] border-[var(--color-accent-blue-border)]',
    'Planned': 'bg-[var(--color-accent-amber-soft)] text-[var(--color-accent-amber)] border-[var(--color-accent-amber-border)]'
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
}

export function ProductScreenshotFrame({ alt, children }: { alt: string; children?: React.ReactNode }) {
  return (
    <div className="w-full aspect-video rounded-xl border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] flex items-center justify-center overflow-hidden relative group">
      {children ? (
        children
      ) : (
        <div className="text-center p-6 flex flex-col items-center">
          <div className="w-16 h-16 mb-4 rounded-full border border-dashed border-[var(--color-ad-border)] flex items-center justify-center text-[var(--color-ad-text-muted)]">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-[var(--color-ad-text-muted)] font-medium">Screenshot Placeholder</p>
          <p className="text-xs text-[var(--color-ad-text-muted)] opacity-70 mt-1">{alt}</p>
        </div>
      )}
      <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none"></div>
    </div>
  );
}

export function CallToAction({ title, description, primaryText, primaryTo, secondaryText, secondaryTo }: { title: string; description: string; primaryText: string; primaryTo: string; secondaryText?: string; secondaryTo?: string }) {
  return (
    <div className="py-20 text-center relative overflow-hidden rounded-2xl border border-[var(--color-accent-purple-border)] bg-gradient-to-b from-[var(--color-accent-purple-soft)] to-transparent">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent-purple)] to-transparent opacity-50"></div>
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight max-w-3xl mx-auto">{title}</h2>
      <p className="text-lg md:text-xl text-[var(--color-ad-text-muted)] mb-10 max-w-2xl mx-auto">{description}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a href={primaryTo} className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-white bg-[var(--color-accent-purple)] rounded-md hover:bg-[var(--color-accent-purple-hover)] hover:shadow-[0_0_20px_var(--color-accent-purple-glow)] transition-all">
          {primaryText}
        </a>
        {secondaryText && secondaryTo && (
          <a href={secondaryTo} className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-white bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-md hover:bg-[var(--color-ad-surface-hover)] transition-all">
            {secondaryText}
          </a>
        )}
      </div>
    </div>
  );
}
